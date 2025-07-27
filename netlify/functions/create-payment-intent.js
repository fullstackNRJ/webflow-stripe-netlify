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
        const { amount, currency = 'usd', paymentMode, itemName } = JSON.parse(event.body);

        // Validate amount
        if (!amount || amount < 50) { // Minimum 50 cents
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Amount must be at least 50 cents' })
            };
        }

        // Create payment intent with metadata
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                payment_mode: paymentMode || 'unknown',
                item_name: itemName || 'Unknown Item',
                timestamp: new Date().toISOString()
            },
            description: itemName ? `Payment for: ${itemName}` : 'Payment'
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                client_secret: paymentIntent.client_secret
            })
        };

    } catch (error) {
        console.error('Error creating payment intent:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: error.message || 'An error occurred while processing your request'
            })
        };
    }
};
