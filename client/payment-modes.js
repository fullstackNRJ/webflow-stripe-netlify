// Payment modes configuration
// You can customize these payment options according to your business needs

const PAYMENT_MODES = [
    {
        id: 'premium-course',
        name: 'Premium Course',
        description: 'Complete web development course with lifetime access',
        price: 29.99,
        category: 'education'
    },
    {
        id: 'consultation',
        name: '1-on-1 Consultation',
        description: '60-minute personalized consultation session',
        price: 49.99,
        category: 'service'
    },
    {
        id: 'business-package',
        name: 'Business Package',
        description: 'Complete business solution with ongoing support',
        price: 99.99,
        category: 'package'
    },
    {
        id: 'monthly-subscription',
        name: 'Monthly Subscription',
        description: 'Access to all premium features and content',
        price: 19.99,
        category: 'subscription'
    },
    {
        id: 'donation',
        name: 'Make a Donation',
        description: 'Support our work with a custom amount',
        price: 'custom',
        category: 'donation',
        minAmount: 1.00
    },
    {
        id: 'custom-payment',
        name: 'Custom Payment',
        description: 'Enter your own amount for other services',
        price: 'custom',
        category: 'custom',
        minAmount: 0.50
    }
];

// Function to generate payment mode HTML
function generatePaymentModeHTML(mode) {
    const priceDisplay = mode.price === 'custom' ? 'Custom Amount' : `$${mode.price}`;

    return `
        <div class="payment-mode" 
             data-mode="${mode.id}" 
             data-amount="${mode.price === 'custom' ? 'custom' : Math.round(mode.price * 100)}" 
             data-name="${mode.name}"
             data-category="${mode.category}">
            <h4>${mode.name}</h4>
            <p>${mode.description}</p>
            <div class="price">${priceDisplay}</div>
        </div>
    `;
}

// Function to render all payment modes
function renderPaymentModes() {
    const container = document.getElementById('payment-modes');
    if (container) {
        container.innerHTML = PAYMENT_MODES.map(generatePaymentModeHTML).join('');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PAYMENT_MODES, generatePaymentModeHTML, renderPaymentModes };
}
