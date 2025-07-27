// Configure Stripe with your publishable key
// You can get this from your .env file or directly set it here
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_stripe_publishable_key_here'; // Replace with your actual key
const NETLIFY_FUNCTION_URL = '/.netlify/functions/create-payment-intent'; // Adjust if needed

// Initialize Stripe
const stripe = Stripe(STRIPE_PUBLISHABLE_KEY);

// Create an instance of Elements
const elements = stripe.elements();

// Create card Element
const cardElement = elements.create('card', {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
});

// Mount the card Element
cardElement.mount('#card-element');

// Payment mode selection variables
let selectedMode = null;
let selectedAmount = 0;
let selectedName = '';

// Get DOM elements
const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');
const loadingDiv = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const paymentModes = document.querySelectorAll('.payment-mode');
const customAmountSection = document.getElementById('custom-amount-section');
const customAmountInput = document.getElementById('custom-amount');
const paymentSummary = document.getElementById('payment-summary');
const summaryItem = document.getElementById('summary-item');
const summaryTotal = document.getElementById('summary-total');

// Handle payment mode selection
paymentModes.forEach(mode => {
    mode.addEventListener('click', function () {
        // Remove selected class from all modes
        paymentModes.forEach(m => m.classList.remove('selected'));

        // Add selected class to clicked mode
        this.classList.add('selected');

        // Get mode data
        selectedMode = this.dataset.mode;
        const amount = this.dataset.amount;
        selectedName = this.dataset.name;

        // Handle custom amount modes
        if (amount === 'custom') {
            customAmountSection.classList.add('show');
            selectedAmount = 0;
            updatePaymentSummary();

            // Focus on custom amount input
            setTimeout(() => customAmountInput.focus(), 100);
        } else {
            customAmountSection.classList.remove('show');
            selectedAmount = parseInt(amount);
            updatePaymentSummary();
        }
    });
});

// Handle custom amount input
customAmountInput.addEventListener('input', function () {
    const value = parseFloat(this.value);
    if (value >= 0.50) {
        selectedAmount = Math.round(value * 100); // Convert to cents
        updatePaymentSummary();
    } else {
        selectedAmount = 0;
        updatePaymentSummary();
    }
});

// Update payment summary
function updatePaymentSummary() {
    if (selectedMode && selectedAmount > 0) {
        paymentSummary.classList.add('show');
        summaryItem.textContent = selectedName;
        summaryTotal.textContent = `Total: $${(selectedAmount / 100).toFixed(2)}`;
        submitButton.disabled = false;
        submitButton.textContent = `Pay $${(selectedAmount / 100).toFixed(2)}`;
    } else if (selectedMode && selectedAmount === 0) {
        paymentSummary.classList.add('show');
        summaryItem.textContent = selectedName;
        summaryTotal.textContent = 'Please enter an amount';
        submitButton.disabled = true;
        submitButton.textContent = 'Enter Amount';
    } else {
        paymentSummary.classList.remove('show');
        submitButton.disabled = true;
        submitButton.textContent = 'Select Payment Mode';
    }
}

// Handle real-time validation errors from the card Element
cardElement.addEventListener('change', ({ error }) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
        displayError.textContent = error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate selection
    if (!selectedMode || selectedAmount <= 0) {
        document.getElementById('card-errors').textContent = 'Please select a payment mode and amount.';
        return;
    }

    // Disable the submit button and show loading
    submitButton.disabled = true;
    submitButton.textContent = 'Processing...';
    loadingDiv.style.display = 'block';

    try {
        // Create payment intent on the server
        const response = await fetch(NETLIFY_FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: selectedAmount,
                currency: 'usd',
                paymentMode: selectedMode,
                itemName: selectedName
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const { client_secret, error } = await response.json();

        if (error) {
            throw new Error(error);
        }

        // Confirm the payment
        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
            payment_method: {
                card: cardElement,
            }
        });

        if (stripeError) {
            // Show error to customer
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = stripeError.message;
        } else {
            // Payment succeeded
            if (paymentIntent.status === 'succeeded') {
                form.style.display = 'none';
                loadingDiv.style.display = 'none';
                successMessage.style.display = 'block';
                successMessage.innerHTML = `
                    <h3>Payment Successful!</h3>
                    <p>Thank you for your purchase of: <strong>${selectedName}</strong></p>
                    <p>Amount paid: <strong>$${(selectedAmount / 100).toFixed(2)}</strong></p>
                    <p>Payment ID: ${paymentIntent.id}</p>
                `;
                console.log('Payment succeeded:', paymentIntent);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = 'An error occurred while processing your payment. Please try again.';
    }

    // Re-enable the submit button
    submitButton.disabled = false;
    updatePaymentSummary(); // Reset button text
    loadingDiv.style.display = 'none';
});
