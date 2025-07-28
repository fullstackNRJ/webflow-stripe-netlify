#!/bin/bash

# Test script for Stripe endpoints
# Run this after updating your .env file with correct keys

BASE_URL="http://localhost:3003"

echo "Testing Stripe Integration Endpoints..."
echo "======================================"

# Test 1: Payment Intent - Valid request
echo -e "\n1. Testing Payment Intent - Valid Request:"
curl -X POST $BASE_URL/.netlify/functions/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2999, "currency": "usd", "paymentMode": "test", "itemName": "Test Item"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 2: Payment Intent - Invalid amount
echo -e "\n2. Testing Payment Intent - Invalid Amount (too small):"
curl -X POST $BASE_URL/.netlify/functions/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "currency": "usd", "paymentMode": "test", "itemName": "Test Item"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 3: Checkout Session - Valid request
echo -e "\n3. Testing Checkout Session - Valid Request:"
curl -X POST $BASE_URL/.netlify/functions/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2, "returnUrl": "'$BASE_URL'/checkout-success.html?session_id={CHECKOUT_SESSION_ID}", "customerEmail": "test@example.com"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 4: Checkout Session - Invalid quantity
echo -e "\n4. Testing Checkout Session - Invalid Quantity:"
curl -X POST $BASE_URL/.netlify/functions/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"quantity": 0, "returnUrl": "'$BASE_URL'/checkout-success.html?session_id={CHECKOUT_SESSION_ID}"}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 5: Checkout Session - Missing return URL
echo -e "\n5. Testing Checkout Session - Missing Return URL:"
curl -X POST $BASE_URL/.netlify/functions/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"quantity": 1}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test 6: CORS Options request
echo -e "\n6. Testing CORS - Options Request:"
curl -X OPTIONS $BASE_URL/.netlify/functions/create-checkout-session \
  -H "Origin: http://localhost:3003" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -w "\nHTTP Status: %{http_code}\n"

echo -e "\n======================================"
echo "Test completed!"
echo "Note: Make sure your .env file has the correct Stripe secret key"
echo "Visit the pages:"
echo "- Payment Intents: $BASE_URL"
echo "- Checkout Sessions: $BASE_URL/checkout-session.html"
