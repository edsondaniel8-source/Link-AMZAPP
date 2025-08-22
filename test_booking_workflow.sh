#!/bin/bash

echo "=== Testing Complete Booking Confirmation Workflow ==="
echo ""

# Test 1: Customer Bookings API
echo "1. Testing Customer Bookings API..."
response=$(curl -s http://localhost:5000/api/bookings/user/user-1)
if [[ $response == *"booking-"* ]]; then
    echo "✓ Customer bookings API working"
else
    echo "✗ Customer bookings API failed"
fi
echo ""

# Test 2: Provider Bookings API  
echo "2. Testing Provider Bookings API..."
response=$(curl -s http://localhost:5000/api/bookings/provider/user-1)
if [[ $response == *"booking-provider-"* ]]; then
    echo "✓ Provider bookings API working"
else
    echo "✗ Provider bookings API failed"
fi
echo ""

# Test 3: Booking Approval
echo "3. Testing Booking Approval..."
response=$(curl -s -X POST http://localhost:5000/api/bookings/booking-provider-1/approve \
    -H "Content-Type: application/json" \
    -d '{"providerId":"user-1"}')
if [[ $response == *"aprovada"* ]]; then
    echo "✓ Booking approval working"
else
    echo "✗ Booking approval failed"
fi
echo ""

# Test 4: Booking Rejection
echo "4. Testing Booking Rejection..."
response=$(curl -s -X POST http://localhost:5000/api/bookings/booking-provider-2/reject \
    -H "Content-Type: application/json" \
    -d '{"providerId":"user-1","reason":"Teste de rejeição automática"}')
if [[ $response == *"rejeitada"* ]]; then
    echo "✓ Booking rejection working"
else
    echo "✗ Booking rejection failed"
fi
echo ""

# Test 5: Customer Confirmation
echo "5. Testing Customer Confirmation..."
response=$(curl -s -X POST http://localhost:5000/api/bookings/booking-provider-1/confirm \
    -H "Content-Type: application/json" \
    -d '{"userId":"customer-1"}')
if [[ $response == *"confirmada"* ]]; then
    echo "✓ Customer confirmation working"
else
    echo "✗ Customer confirmation failed"
fi
echo ""

# Test 6: Rides API
echo "6. Testing Rides Search API..."
response=$(curl -s "http://localhost:5000/api/rides/search?from=Maputo&to=Beira")
if [[ $response == *"ride-"* ]]; then
    echo "✓ Rides search API working"
else
    echo "✗ Rides search API failed"
fi
echo ""

# Test 7: Accommodations API
echo "7. Testing Accommodations Search API..."
response=$(curl -s "http://localhost:5000/api/accommodations/search?location=Maputo")
if [[ $response == *"acc-"* ]]; then
    echo "✓ Accommodations search API working"
else
    echo "✗ Accommodations search API failed"
fi
echo ""

echo "=== Test Summary ==="
echo "All booking confirmation workflow components tested!"