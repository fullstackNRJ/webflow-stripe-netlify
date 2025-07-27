# Webflow Stripe Netlify Integration

A complete template for integrating Stripe payments with Webflow using Netlify Functions. This template provides a secure, production-ready payment form that can be easily embedded into any Webflow site.

## Features

- 🔒 Secure Stripe Elements integration
- 🛍️ **Multiple payment modes** - customers can choose what to pay for
- 💰 **Flexible pricing** - fixed prices or custom amounts
- 🌐 CORS-enabled Netlify Functions
- 🚀 One-click Netlify deployment
- 🎨 Customizable payment form
- 📱 Mobile-responsive design
- 🔧 Environment-based configuration
- ⚙️ **Easy configuration** - visual admin interface for payment modes

## Quick Start

### 1. One-Click Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/webflow-stripe-netlify)

### 2. Manual Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd webflow-stripe-netlify
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Stripe keys:
   ```env
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
   ALLOWED_ORIGINS=http://localhost:3000,https://your-webflow-site.com
   ```

4. **Run locally**
   ```bash
   npm run dev
   ```

## Getting Your Stripe Keys

1. Create a [Stripe account](https://stripe.com) if you don't have one
2. Go to your Stripe Dashboard
3. Navigate to **Developers** → **API keys**
4. Copy your **Publishable key** and **Secret key**
5. For production, use live keys; for testing, use test keys

## Deploying to Netlify

### Method 1: One-Click Deploy (Recommended)

1. Click the "Deploy to Netlify" button above
2. Connect your GitHub account
3. Choose a repository name
4. Set your environment variables in Netlify dashboard:
   - Go to **Site settings** → **Environment variables**
   - Add `STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
   - Add `ALLOWED_ORIGINS` with your Webflow site URL

### Method 2: Manual Deploy

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod
   ```

4. **Set environment variables**
   ```bash
   netlify env:set STRIPE_PUBLISHABLE_KEY "pk_test_your_key_here"
   netlify env:set STRIPE_SECRET_KEY "sk_test_your_key_here"
   netlify env:set ALLOWED_ORIGINS "https://your-webflow-site.com"
   ```

## Adding to Webflow

### Option 1: Iframe Embed (Easiest)

1. Add an **Embed** element to your Webflow page
2. Paste this code:
   ```html
   <iframe 
     src="https://your-netlify-site.netlify.app" 
     width="100%" 
     height="600" 
     frameborder="0">
   </iframe>
   ```

### Option 2: Direct Integration (Advanced)

1. **Add Stripe.js to your Webflow site**
   - Go to **Project Settings** → **Custom Code**
   - Add to **Head Code**:
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

2. **Add the payment form HTML**
   - Add an **Embed** element where you want the form
   - Copy the HTML from `client/index.html` (excluding `<html>`, `<head>`, `<body>` tags)

3. **Add the JavaScript**
   - Copy the content of `client/stripe-form.js`
   - Update the `STRIPE_PUBLISHABLE_KEY` and `NETLIFY_FUNCTION_URL`
   - Add to **Project Settings** → **Custom Code** → **Footer Code** or before `</body>` tag

4. **Update the JavaScript configuration**
   ```javascript
   const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_key_here';
   const NETLIFY_FUNCTION_URL = 'https://your-netlify-site.netlify.app/.netlify/functions/create-payment-intent';
   ```

## Customization

### Configuring Payment Modes

The payment form now supports multiple payment modes! Customers can choose from:

- **Fixed-price items** (courses, consultations, packages)
- **Custom amount options** (donations, custom services)
- **Categorized options** (products, services, subscriptions, etc.)

#### Easy Configuration Method
1. Open `client/config.html` in your browser
2. Use the visual interface to add, edit, or remove payment modes
3. Click "Generate Code" to get the updated HTML and JavaScript
4. Copy and paste the generated code into your files

#### Manual Configuration Method
Edit the payment modes directly in `client/index.html`:

```html
<div class="payment-mode" data-mode="your-product" data-amount="2999" data-name="Your Product">
    <h4>Your Product</h4>
    <p>Description of your product or service</p>
    <div class="price">$29.99</div>
</div>
```

For custom amount options, use `data-amount="custom"`:
```html
<div class="payment-mode" data-mode="donation" data-amount="custom" data-name="Donation">
    <h4>Make a Donation</h4>
    <p>Support our work with a custom amount</p>
    <div class="price">Custom Amount</div>
</div>
```

### Styling the Payment Form

The form styles are in `client/index.html`. You can customize:

- Colors and fonts
- Form layout
- Button styling
- Success/error messages

### Modifying Payment Logic

Edit `netlify/functions/create-payment-intent.js` to:

- Add metadata to payments
- Implement webhooks
- Add customer creation
- Modify payment amounts or currency

### Adding Webhooks

1. Create a new Netlify function for webhook handling
2. Add webhook endpoint URL in Stripe Dashboard
3. Verify webhook signatures for security

## Security Considerations

- ✅ Never expose your Stripe secret key on the client side
- ✅ Always validate payments on the server side
- ✅ Use HTTPS in production
- ✅ Validate CORS origins
- ✅ Implement proper error handling

## Testing

### Test Card Numbers

Use these test card numbers with Stripe:

- **Successful payment**: 4242 4242 4242 4242
- **Declined payment**: 4000 0000 0000 0002
- **Authentication required**: 4000 0027 6000 3184

Use any future expiry date, any 3-digit CVC, and any postal code.

## Troubleshooting

### Common Issues

1. **CORS errors**
   - Check `ALLOWED_ORIGINS` environment variable
   - Ensure your Webflow site URL is included

2. **Stripe key errors**
   - Verify keys are set correctly in Netlify
   - Check if using test vs live keys appropriately

3. **Function not found**
   - Ensure Netlify build deployed successfully
   - Check function logs in Netlify dashboard

### Getting Help

- Check Netlify function logs for server-side errors
- Use browser developer tools for client-side issues
- Refer to [Stripe documentation](https://stripe.com/docs)
- Check [Netlify Functions documentation](https://docs.netlify.com/functions/overview/)

## File Structure

```
webflow-stripe-netlify/
├── client/
│   ├── index.html          # Payment form with mode selection
│   ├── stripe-form.js      # Client-side JavaScript
│   ├── payment-modes.js    # Payment modes configuration
│   └── config.html         # Visual configuration interface
├── netlify/
│   └── functions/
│       └── create-payment-intent.js  # Server-side function
├── .env.example            # Environment variables template
├── netlify.toml           # Netlify configuration
├── package.json           # Dependencies
└── README.md             # This file
```

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Review Stripe and Netlify documentation
3. Open an issue in this repository

## License

MIT License - feel free to use this template for your projects!
