const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {

        const {
            quantity = 1,
            returnUrl = "",
            metadata = {},
            customerEmail = "",
            mode = 'payment'
        } = JSON.parse(event.body);

        // Validate required parameters
        if (!process.env.STRIPE_PRICE_ID) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Price ID not configured' })
            };
        }

        if (!returnUrl && !process.env.REDIRECT_URL) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Return URL is required' })
            };
        }

        // Validate quantity
        if (quantity < 1 || quantity > 100) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Quantity must be between 1 and 100' })
            };
        }

        // Create checkout session configuration
        const sessionConfig = {
            line_items: [
                {
                    price: process.env.STRIPE_PRICE_ID,
                    quantity: quantity,
                },
            ],
            mode: mode,
            ui_mode: 'embedded',
            return_url: process.env.REDIRECT_URL || returnUrl,
            metadata: {
                ...metadata,
                timestamp: new Date().toISOString(),
                source: 'webflow-custom-checkout'
            }
        };

        // Add customer email if provided
        if (customerEmail) {
            sessionConfig.customer_email = customerEmail;
        }

        // Create the checkout session
        const session = await stripe.checkout.sessions.create(sessionConfig);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                clientSecret: session.client_secret,
                session_id: session.id,
                url: session.url
            })
        };

    } catch (error) {
        console.error('Error creating checkout session:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'An error occurred while creating the checkout session'
            })
        };
    }
};
