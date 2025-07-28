// Configure Stripe with your publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here'; // Replace with your actual key
const NETLIFY_FUNCTION_URL = '/.netlify/functions/create-checkout-session';

// Initialize Stripe
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Get DOM elements
const form = document.getElementById('checkout-form');
const quantityInput = document.getElementById('quantity');
const emailInput = document.getElementById('customer-email');
const checkoutBtn = document.getElementById('checkout-btn');
const errorMessage = document.getElementById('error-message');
const loading = document.getElementById('loading');
const summary = document.getElementById('summary');
const summaryQuantity = document.getElementById('summary-quantity');
const checkoutDiv = document.getElementById('checkout');

let checkout = null;

// Update summary when quantity changes
quantityInput.addEventListener('input', updateSummary);

function updateSummary() {
    const quantity = parseInt(quantityInput.value) || 1;
    summaryQuantity.textContent = quantity;
    summary.style.display = quantity > 0 ? 'block' : 'none';
}

// Initialize summary
updateSummary();

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear any previous errors
    hideError();

    const quantity = parseInt(quantityInput.value);
    const customerEmail = emailInput.value.trim();

    // Validate quantity
    if (!quantity || quantity < 1 || quantity > 100) {
        showError('Please enter a quantity between 1 and 100');
        return;
    }

    // Show loading state
    showLoading();

    try {
        // Create checkout session
        const response = await fetch(NETLIFY_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quantity: quantity,
                returnUrl: `${window.location.origin}/checkout-success.html?session_id={CHECKOUT_SESSION_ID}`,
                customerEmail: customerEmail || undefined,
                metadata: {
                    source: 'custom-checkout-form',
                    quantity: quantity.toString()
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const { client_secret, error } = await response.json();

        if (error) {
            throw new Error(error);
        }

        // Initialize the embedded checkout
        checkout = await stripe.initEmbeddedCheckout({
            clientSecret: client_secret,
        });

        // Hide the form and show the checkout
        form.style.display = 'none';
        hideLoading();

        // Mount the checkout
        checkout.mount('#checkout');

    } catch (error) {
        console.error('Error creating checkout session:', error);
        showError(error.message || 'An error occurred while creating the checkout session');
        hideLoading();
    }
});

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showLoading() {
    checkoutBtn.disabled = true;
    loading.style.display = 'block';
}

function hideLoading() {
    checkoutBtn.disabled = false;
    loading.style.display = 'none';
}

// Handle page visibility change to destroy checkout when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && checkout) {
        checkout.destroy();
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (checkout) {
        checkout.destroy();
    }
});
