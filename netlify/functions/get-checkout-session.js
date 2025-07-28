const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
    // Handle preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const sessionId = event.queryStringParameters?.session_id;

        if (!sessionId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Session ID is required' })
            };
        }

        // Retrieve the checkout session
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        // Return relevant session information
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: session.id,
                payment_status: session.payment_status,
                status: session.status,
                amount_total: session.amount_total,
                currency: session.currency,
                customer_email: session.customer_details?.email,
                created: session.created,
                metadata: session.metadata
            })
        };

    } catch (error) {
        console.error('Error retrieving checkout session:', error);

        // Handle specific Stripe errors
        if (error.type === 'StripeInvalidRequestError') {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Invalid session ID' })
            };
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'An error occurred while retrieving the session'
            })
        };
    }
};
