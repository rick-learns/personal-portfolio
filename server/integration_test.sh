#!/bin/bash
# Integration Test Script for Portfolio Backend
# This script tests the API endpoints of the Portfolio backend

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}Starting integration tests for Portfolio Backend...${NC}"

# Ask for port
echo -e "${YELLOW}Enter the port number your server is running on (default: 8081):${NC}"
read -r PORT
if [ -z "$PORT" ]; then
    PORT="8081"
fi

# Configuration
BASE_URL="http://localhost:$PORT"
HEALTH_ENDPOINT="$BASE_URL/health"
CONTACT_ENDPOINT="$BASE_URL/api/v1/contact"

echo -e "${CYAN}Testing against server at $BASE_URL${NC}"

# Test health endpoint
echo -e "\n${YELLOW}Testing health endpoint...${NC}"
HEALTH_RESPONSE=$(curl -s $HEALTH_ENDPOINT)
echo -e "${GREEN}Health endpoint response:${NC}"
echo $HEALTH_RESPONSE | jq .

# Check if the status contains "Operational" regardless of the emoji
if echo $HEALTH_RESPONSE | grep -q "Operational"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}❌ Health check failed: Unexpected status${NC}"
    exit 1
fi

# Test contact endpoint - Invalid request (missing fields)
echo -e "\n${YELLOW}Testing contact endpoint with invalid data (missing fields)...${NC}"
INVALID_PAYLOAD='{"name":"Integration Test","message":"This is a test message."}'

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$INVALID_PAYLOAD" $CONTACT_ENDPOINT)

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✅ Contact endpoint correctly rejected invalid data${NC}"
else
    echo -e "${RED}❌ Contact endpoint invalid test failed: Unexpected status code $HTTP_CODE${NC}"
    exit 1
fi

# Test contact endpoint - Invalid request (invalid email)
echo -e "\n${YELLOW}Testing contact endpoint with invalid data (invalid email)...${NC}"
INVALID_EMAIL_PAYLOAD='{"name":"Integration Test","email":"not-an-email","message":"This is a test message with an invalid email."}'

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d "$INVALID_EMAIL_PAYLOAD" $CONTACT_ENDPOINT)

if [ "$HTTP_CODE" -eq 400 ]; then
    echo -e "${GREEN}✅ Contact endpoint correctly rejected invalid email${NC}"
else
    echo -e "${RED}❌ Contact endpoint invalid email test failed: Unexpected status code $HTTP_CODE${NC}"
    exit 1
fi

# Test contact endpoint - Valid request (optional - sends a real email)
echo -e "\n${YELLOW}Would you like to test sending a real email? (y/n)${NC}"
read -r SEND_REAL_EMAIL

if [ "$SEND_REAL_EMAIL" = "y" ]; then
    echo -e "\n${YELLOW}Testing contact endpoint with valid data (will send real email)...${NC}"
    VALID_PAYLOAD='{"name":"Integration Test","email":"test@example.com","message":"This is an automated test message from the integration test script."}'

    CONTACT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d "$VALID_PAYLOAD" $CONTACT_ENDPOINT)
    echo -e "${GREEN}Contact endpoint response:${NC}"
    echo $CONTACT_RESPONSE | jq .

    # Check if the message was sent successfully
    if echo $CONTACT_RESPONSE | grep -q "Message sent successfully"; then
        echo -e "${GREEN}✅ Contact endpoint valid test passed!${NC}"
        echo -e "${GREEN}✅ Check your email at rickykcohen@gmail.com for the test message${NC}"
    else
        echo -e "${RED}❌ Contact endpoint valid test failed: Unexpected response${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}Skipping real email test${NC}"
fi

echo -e "\n${CYAN}🎉 All integration tests passed!${NC}"
