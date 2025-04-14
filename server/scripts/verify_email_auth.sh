#!/bin/bash
# Email Authentication Verification Script
# This script helps verify SPF, DKIM, and DMARC setup for your domain

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Ensure required tools are installed
if ! command_exists dig; then
    echo -e "${RED}Error: 'dig' command not found. Please install bind-utils or dnsutils.${NC}"
    exit 1
fi

# Get domain from argument or prompt
DOMAIN=$1
if [ -z "$DOMAIN" ]; then
    read -p "Enter your domain name (e.g., rick-learns.dev): " DOMAIN
fi

echo -e "${YELLOW}Checking email authentication for domain: ${DOMAIN}${NC}"
echo "=============================================="

# Check SPF record
echo -e "${YELLOW}Checking SPF record...${NC}"
SPF_RECORD=$(dig +short TXT $DOMAIN | grep "v=spf1")

if [ -z "$SPF_RECORD" ]; then
    echo -e "${RED}❌ SPF record not found!${NC}"
    echo "You should add an SPF record to your domain's DNS settings."
    echo "Example: v=spf1 include:spf.resend.com -all"
else
    echo -e "${GREEN}✓ SPF record found:${NC}"
    echo "$SPF_RECORD"
    
    # Check if Resend is included in SPF
    if echo "$SPF_RECORD" | grep -q "include:spf.resend.com"; then
        echo -e "${GREEN}✓ Resend.com is properly included in SPF record${NC}"
    else
        echo -e "${YELLOW}⚠️ Resend.com is not included in SPF record!${NC}"
        echo "Consider adding 'include:spf.resend.com' to your SPF record."
    fi
fi
echo ""

# Check DKIM record
echo -e "${YELLOW}Checking DKIM record...${NC}"
DKIM_RECORD=$(dig +short TXT resend._domainkey.$DOMAIN)

if [ -z "$DKIM_RECORD" ]; then
    echo -e "${RED}❌ DKIM record not found for resend._domainkey.${DOMAIN}!${NC}"
    echo "You should add a DKIM record provided by Resend to your domain's DNS settings."
else
    echo -e "${GREEN}✓ DKIM record found:${NC}"
    echo "$DKIM_RECORD"
fi
echo ""

# Check DMARC record
echo -e "${YELLOW}Checking DMARC record...${NC}"
DMARC_RECORD=$(dig +short TXT _dmarc.$DOMAIN)

if [ -z "$DMARC_RECORD" ]; then
    echo -e "${RED}❌ DMARC record not found!${NC}"
    echo "You should add a DMARC record to your domain's DNS settings."
    echo "Example: v=DMARC1; p=quarantine; rua=mailto:admin@${DOMAIN}; pct=100; adkim=r; aspf=r"
else
    echo -e "${GREEN}✓ DMARC record found:${NC}"
    echo "$DMARC_RECORD"
    
    # Check DMARC policy
    if echo "$DMARC_RECORD" | grep -q "p=none"; then
        echo -e "${YELLOW}⚠️ DMARC policy is set to 'none'${NC}"
        echo "This means no action will be taken for failed authentication."
        echo "Consider changing to 'p=quarantine' or 'p=reject' once you've verified everything works."
    elif echo "$DMARC_RECORD" | grep -q "p=quarantine"; then
        echo -e "${GREEN}✓ DMARC policy is set to 'quarantine'${NC}"
        echo "Emails that fail authentication will be sent to spam."
    elif echo "$DMARC_RECORD" | grep -q "p=reject"; then
        echo -e "${GREEN}✓ DMARC policy is set to 'reject'${NC}"
        echo "Emails that fail authentication will be rejected."
    fi
    
    # Check if reporting is configured
    if echo "$DMARC_RECORD" | grep -q "rua=mailto:"; then
        echo -e "${GREEN}✓ DMARC aggregate reports are configured${NC}"
    else
        echo -e "${YELLOW}⚠️ DMARC reports are not configured!${NC}"
        echo "Consider adding 'rua=mailto:admin@${DOMAIN}' to receive reports."
    fi
fi
echo ""

# Additional checks
echo -e "${YELLOW}Performing additional checks...${NC}"

# Check MX records
MX_RECORDS=$(dig +short MX $DOMAIN)
if [ -z "$MX_RECORDS" ]; then
    echo -e "${YELLOW}⚠️ No MX records found for ${DOMAIN}${NC}"
    echo "If you plan to receive email on this domain, you should set up MX records."
else
    echo -e "${GREEN}✓ MX records found:${NC}"
    echo "$MX_RECORDS"
fi
echo ""

# Summary
echo -e "${YELLOW}=== Email Authentication Summary ===${NC}"
if [ -z "$SPF_RECORD" ] || [ -z "$DKIM_RECORD" ] || [ -z "$DMARC_RECORD" ]; then
    echo -e "${YELLOW}⚠️ Your email authentication setup is incomplete.${NC}"
    echo "Complete the missing records to improve email deliverability."
else
    echo -e "${GREEN}✓ Basic email authentication is set up for ${DOMAIN}${NC}"
    echo "Monitor your email deliverability and DMARC reports for any issues."
fi

echo ""
echo "For detailed setup instructions, refer to server/docs/email_authentication_setup.md"
echo ""
echo "To test your email authentication completely, send a test email and check it with:"
echo "- https://www.mail-tester.com/"
echo "- https://mxtoolbox.com/dmarc.aspx"
echo "- https://dmarcian.com/dmarc-inspector/"
