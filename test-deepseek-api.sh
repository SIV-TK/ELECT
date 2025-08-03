#!/bin/bash

echo "Testing DeepSeek API access..."

# Test 1: Check if API key is loaded in environment
if [ -n "$DEEPSEEK_API_KEY" ]; then
    echo "✅ DEEPSEEK_API_KEY is set"
else
    echo "❌ DEEPSEEK_API_KEY is not set"
    echo "Loading from .env.local..."
    source .env.local
    if [ -n "$DEEPSEEK_API_KEY" ]; then
        echo "✅ DEEPSEEK_API_KEY loaded from .env.local"
    else
        echo "❌ DEEPSEEK_API_KEY not found in .env.local"
        exit 1
    fi
fi

# Test 2: Test DeepSeek API connectivity
echo "Testing DeepSeek API connectivity..."
response=$(curl -s -w "HTTP_CODE:%{http_code}" \
  -X POST "https://api.deepseek.com/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $DEEPSEEK_API_KEY" \
  -d '{
    "model": "deepseek-chat",
    "messages": [{"role": "user", "content": "Hello"}],
    "max_tokens": 10
  }')

http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
content=$(echo "$response" | sed 's/HTTP_CODE:[0-9]*$//')

if [ "$http_code" = "200" ]; then
    echo "✅ DeepSeek API is accessible"
    echo "Response: $content"
else
    echo "❌ DeepSeek API error (HTTP $http_code)"
    echo "Response: $content"
fi

echo "Middleware restrictions test complete!"
