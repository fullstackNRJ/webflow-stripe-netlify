# Webflow Integration Guide

This guide provides step-by-step instructions for integrating the Stripe payment form with **payment mode selection** into your Webflow site.

## New Features ✨

- **Multiple Payment Options**: Customers can choose from predefined products/services
- **Custom Amount Support**: Allow donations or custom pricing
- **Payment Summary**: Clear breakdown before payment
- **Visual Configuration**: Easy-to-use admin interface for managing payment modes

## Method 1: Iframe Embed (Recommended for Beginners)

### Step 1: Deploy to Netlify
1. Use the one-click deploy button in the README
2. Set up your environment variables (Stripe keys)
3. Note your Netlify site URL (e.g., `https://amazing-site-123.netlify.app`)

### Step 2: Add to Webflow
1. In Webflow Designer, drag an **Embed** element to your page
2. Paste this code:
```html
<div id="checkout">
        <!-- Checkout will insert the payment form here -->
      </div>
<script src="https://js.stripe.com/v3/"></script>
<script>
  async function mountStripe() {
  async function fetchClientSecret(){
  const response = await fetch(
      '<YOUR_NETLIFY_SITE_URL>/.netlify/functions/create-checkout-session', //this is your netlify site url : https://amazing-site-123.netlify.app
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata:{} }) /* you can pass some metadata or returnUrl. 
         returnUrl = "",
            metadata = {},
            customerEmail = "",
            these are optional but useful.
        */   
      }
    );
    
    const { clientSecret } = await response.json();
return clientSecret;
}

    const stripe = Stripe('<YOUR_PUBLISHABLE_STRIPE_KEY'); // your Stripe publishable key
  	const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret
  });

  // Mount Checkout
  checkout.mount('#checkout');
  
  }

  mountStripe();
</script>
```
3. Replace `your-netlify-site.netlify.app` with your actual Netlify URL
4. **Note**: Height increased to 700px to accommodate payment mode selection

### Step 3: Style the Container
- Add custom CSS to style the iframe container
- Consider adding loading states
- Ensure mobile responsiveness






---------------------------------------------------------------------------------





## Method 2: Direct Integration (Advanced)

### Step 1: Add Stripe.js
1. Go to **Project Settings** → **Custom Code**
2. In **Head Code**, add:
```html
<script src="https://js.stripe.com/v3/"></script>
```

### Step 2: Create the Form Structure
1. Add a **Div Block** with ID `payment-form-container`
2. Inside, add:
   - **Form Block** with ID `payment-form`
   - **Div Block** with ID `payment-modes` (for payment mode selection)
   - **Div Block** with ID `custom-amount-section` (for custom amounts)
   - **Div Block** with ID `payment-summary` (for payment summary)
   - **Div Block** with ID `card-element` (for Stripe Elements)
   - **Div Block** with ID `card-errors` (for error messages)
   - **Submit Button** with ID `submit-button`

### Step 3: Add Payment Mode Options
1. Inside the `payment-modes` div, add multiple **Div Blocks** for each payment option
2. Each payment mode div should have:
   - Class: `payment-mode`
   - Custom attributes:
     - `data-mode`: unique identifier (e.g., "premium-course")
     - `data-amount`: price in cents (e.g., "2999" for $29.99) or "custom"
     - `data-name`: display name (e.g., "Premium Course")
3. Structure each payment mode with:
   - **Heading** for the title
   - **Text** for description
   - **Div** with class `price` for price display

### Step 3: Add the JavaScript
1. Go to **Project Settings** → **Custom Code**
2. In **Footer Code**, add the modified `stripe-form.js`
3. Update these variables:
```javascript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_actual_key_here';
const NETLIFY_FUNCTION_URL = 'https://your-netlify-site.netlify.app/.netlify/functions/create-payment-intent';
```

### Step 4: Style with Webflow
Use Webflow's visual designer to style:
- Form layout and spacing
- Input field styles
- Button appearance
- Error message styling
- Success states

## Method 3: Custom Webflow Component

### Step 1: Create a Symbol
1. Create a new Symbol called "Stripe Payment Form"
2. Build the form structure using Webflow elements
3. Add the necessary IDs to each element

### Step 2: Add Interactions
1. Create interactions for:
   - Form submission states
   - Loading animations
   - Success/error messages
   - Button state changes

### Step 3: Embed the Logic
1. Use an **Embed** element within the Symbol
2. Add only the JavaScript logic (no HTML)
3. Initialize Stripe and mount elements

## Styling Tips

### Custom CSS for Better Integration
Add this CSS to match your Webflow design:

```css
/* Payment form container */
#payment-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* Stripe Elements styling */
#card-element {
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  transition: border-color 0.2s;
}

#card-element:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Error messages */
#card-errors {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

/* Submit button */
#submit-button {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

#submit-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

#submit-button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
```

### Responsive Considerations
```css
@media (max-width: 768px) {
  #payment-form {
    margin: 1rem;
    padding: 1.5rem;
  }
  
  iframe {
    height: 500px;
  }
}
```

## Security & CORS Setup

### Important: Update CORS Settings
In your Netlify environment variables, set:
```
ALLOWED_ORIGINS=https://your-webflow-site.webflow.io,https://your-custom-domain.com
```

Include all domains where your Webflow site will be accessed:
- Webflow staging URL
- Published webflow.io URL  
- Custom domain
- Local development (if testing)

## Testing Your Integration

### 1. Test with Stripe Test Cards
- **4242 4242 4242 4242** - Successful payment
- **4000 0000 0000 0002** - Declined payment
- Use any future date, any CVC, any postal code

### 2. Check Browser Console
- Look for JavaScript errors
- Verify Stripe key is loading
- Check network requests to Netlify functions

### 3. Verify in Stripe Dashboard
- Check test payments appear in Stripe
- Verify payment amounts are correct
- Review any error logs

## Common Issues & Solutions

### 1. CORS Errors
**Problem**: Payment form shows CORS error
**Solution**: 
- Add your Webflow domain to `ALLOWED_ORIGINS`
- Include both staging and production URLs
- Redeploy Netlify site after environment changes

### 2. Stripe Elements Not Loading
**Problem**: Card input field doesn't appear
**Solution**:
- Verify Stripe.js is loaded in head
- Check browser console for JavaScript errors
- Ensure element IDs match between HTML and JS

### 3. Form Not Submitting
**Problem**: Payment button doesn't work
**Solution**:
- Check network tab for failed requests
- Verify Netlify function URL is correct
- Ensure Stripe keys are set in Netlify environment

### 4. Styling Issues
**Problem**: Form doesn't match site design
**Solution**:
- Use Webflow's style panel for basic styling
- Add custom CSS for advanced styling
- Test responsive design on different devices

## Advanced Customizations

### Add Customer Information
Modify the payment form to collect:
- Customer name
- Email address
- Billing address

### Multiple Payment Methods
- Add support for PayPal
- Include Apple Pay/Google Pay
- Support bank transfers

### Subscription Payments
- Implement recurring billing
- Add subscription management
- Handle plan changes

### Webhooks Integration
- Set up payment confirmation webhooks
- Handle failed payments
- Send confirmation emails

## Need Help?

1. **Webflow-specific issues**: Check Webflow forums
2. **Stripe integration**: Review Stripe documentation
3. **Netlify deployment**: Check Netlify support docs
4. **General questions**: Open an issue in this repository

Remember to always test thoroughly before going live with real payments!
