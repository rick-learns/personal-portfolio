# Email Authentication Setup Guide

This guide provides instructions on how to set up email authentication for your domain `rick-learns.dev` using SPF, DKIM, and DMARC. This will improve email deliverability and prevent email spoofing.

## Prerequisites

- Access to your domain's DNS settings
- Account with Resend email service
- Administrative access to your email service

## 1. SPF (Sender Policy Framework) Setup

SPF allows receiving mail servers to verify that incoming mail from your domain was sent by a server authorized by you.

### Step 1: Create SPF Record

Add a TXT record to your domain's DNS with the following details:

- **Record Type**: TXT
- **Host/Name**: @ (or leave blank for the root domain)
- **Value**: `v=spf1 include:spf.resend.com -all`

### Step 2: Verify SPF Record

After adding the SPF record, you can verify it using:

```bash
dig TXT rick-learns.dev
```

Look for the SPF record in the response. It may take up to 48 hours for DNS changes to propagate.

## 2. DKIM (DomainKeys Identified Mail) Setup

DKIM adds a digital signature to your outgoing emails that is validated against a public key published in your domain's DNS.

### Step 1: Obtain DKIM Information from Resend

1. Log in to your Resend account dashboard
2. Navigate to "Domains" or "Email Authentication"
3. Select your domain or add a new domain
4. Look for DKIM setup instructions

### Step 2: Add DKIM Record to DNS

Add a TXT record with the following details (using values from Resend):

- **Record Type**: TXT
- **Host/Name**: `resend._domainkey.rick-learns.dev`
- **Value**: Provided by Resend, will look like:
  ```
  v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...
  ```

### Step 3: Verify DKIM Record

After adding the DKIM record, verify it using:

```bash
dig TXT resend._domainkey.rick-learns.dev
```

## 3. DMARC (Domain-based Message Authentication, Reporting & Conformance) Setup

DMARC tells receiving mail servers what to do if an email fails SPF or DKIM checks and provides reporting.

### Step 1: Create DMARC Record

Add a TXT record with the following details:

- **Record Type**: TXT
- **Host/Name**: `_dmarc.rick-learns.dev`
- **Value**: `v=DMARC1; p=quarantine; rua=mailto:admin@rick-learns.dev; pct=100; adkim=r; aspf=r`

This configuration means:
- `p=quarantine`: Emails that fail authentication will be sent to spam folder
- `rua=mailto:admin@rick-learns.dev`: Reports about failures will be sent to this address
- `pct=100`: Apply policy to 100% of emails
- `adkim=r` and `aspf=r`: Relaxed alignment mode for DKIM and SPF

### Step 2: Verify DMARC Record

```bash
dig TXT _dmarc.rick-learns.dev
```

## 4. Update Resend Configuration

After setting up all DNS records, return to your Resend account to verify the domain:

1. Log in to Resend
2. Navigate to "Domains" or "Settings"
3. Trigger verification for your domain
4. Resend will check all DNS records

## 5. Testing Your Email Authentication

After setup, you can test your email authentication using:

1. **Mail Tester**: Send an email to an address provided by [mail-tester.com](https://www.mail-tester.com/)
2. **DMARC Analyzer**: Use online tools like [DMARC Analyzer](https://www.dmarcanalyzer.com/)
3. **Manual Test**: Send an email to a Gmail or Outlook account and check the email headers

## Monitoring and Maintenance

- Review DMARC reports sent to your specified email address
- Periodically check your authentication setup using online tools
- Update your records if you change email service providers

## Troubleshooting

- **DNS Propagation**: Changes can take up to 48 hours to take effect
- **Record Format**: Ensure there are no extra spaces or line breaks in your records
- **Service Limitations**: Some DNS providers have limitations on TXT record length

## Additional Resources

- [Resend DNS Verification Guide](https://resend.com/docs/dashboard/domains/dns-verification)
- [DMARC.org Resources](https://dmarc.org/)
- [SPF Record Syntax](https://www.spf-record.com/syntax)
