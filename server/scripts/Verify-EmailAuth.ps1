# Email Authentication Verification Script
# This PowerShell script helps verify SPF, DKIM, and DMARC setup for your domain

# Function to check DNS records
function Get-DnsRecord {
    param (
        [string]$Domain,
        [string]$RecordType
    )
    
    try {
        $result = Resolve-DnsName -Name $Domain -Type $RecordType -ErrorAction SilentlyContinue
        return $result
    } catch {
        return $null
    }
}

# Get domain from argument or prompt
$Domain = $args[0]
if (-not $Domain) {
    $Domain = Read-Host "Enter your domain name (e.g., rick-learns.dev)"
}

Write-Host "Checking email authentication for domain: $Domain" -ForegroundColor Yellow
Write-Host "=============================================="

# Check SPF record
Write-Host "Checking SPF record..." -ForegroundColor Yellow
$TxtRecords = Get-DnsRecord -Domain $Domain -RecordType "TXT"
$SpfRecord = $TxtRecords | Where-Object { $_.Strings -match "v=spf1" } | Select-Object -ExpandProperty Strings

if (-not $SpfRecord) {
    Write-Host "❌ SPF record not found!" -ForegroundColor Red
    Write-Host "You should add an SPF record to your domain's DNS settings."
    Write-Host "Example: v=spf1 include:spf.resend.com -all"
} else {
    Write-Host "✓ SPF record found:" -ForegroundColor Green
    Write-Host $SpfRecord
    
    # Check if Resend is included in SPF
    if ($SpfRecord -match "include:spf.resend.com") {
        Write-Host "✓ Resend.com is properly included in SPF record" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Resend.com is not included in SPF record!" -ForegroundColor Yellow
        Write-Host "Consider adding 'include:spf.resend.com' to your SPF record."
    }
}
Write-Host ""

# Check DKIM record
Write-Host "Checking DKIM record..." -ForegroundColor Yellow
$DkimDomain = "resend._domainkey.$Domain"
$DkimRecords = Get-DnsRecord -Domain $DkimDomain -RecordType "TXT"
$DkimRecord = $DkimRecords | Select-Object -ExpandProperty Strings -ErrorAction SilentlyContinue

if (-not $DkimRecord) {
    Write-Host "❌ DKIM record not found for $DkimDomain!" -ForegroundColor Red
    Write-Host "You should add a DKIM record provided by Resend to your domain's DNS settings."
} else {
    Write-Host "✓ DKIM record found:" -ForegroundColor Green
    Write-Host $DkimRecord
}
Write-Host ""

# Check DMARC record
Write-Host "Checking DMARC record..." -ForegroundColor Yellow
$DmarcDomain = "_dmarc.$Domain"
$DmarcRecords = Get-DnsRecord -Domain $DmarcDomain -RecordType "TXT"
$DmarcRecord = $DmarcRecords | Select-Object -ExpandProperty Strings -ErrorAction SilentlyContinue

if (-not $DmarcRecord) {
    Write-Host "❌ DMARC record not found!" -ForegroundColor Red
    Write-Host "You should add a DMARC record to your domain's DNS settings."
    Write-Host "Example: v=DMARC1; p=quarantine; rua=mailto:admin@$Domain; pct=100; adkim=r; aspf=r"
} else {
    Write-Host "✓ DMARC record found:" -ForegroundColor Green
    Write-Host $DmarcRecord
    
    # Check DMARC policy
    if ($DmarcRecord -match "p=none") {
        Write-Host "⚠️ DMARC policy is set to 'none'" -ForegroundColor Yellow
        Write-Host "This means no action will be taken for failed authentication."
        Write-Host "Consider changing to 'p=quarantine' or 'p=reject' once you've verified everything works."
    } elseif ($DmarcRecord -match "p=quarantine") {
        Write-Host "✓ DMARC policy is set to 'quarantine'" -ForegroundColor Green
        Write-Host "Emails that fail authentication will be sent to spam."
    } elseif ($DmarcRecord -match "p=reject") {
        Write-Host "✓ DMARC policy is set to 'reject'" -ForegroundColor Green
        Write-Host "Emails that fail authentication will be rejected."
    }
    
    # Check if reporting is configured
    if ($DmarcRecord -match "rua=mailto:") {
        Write-Host "✓ DMARC aggregate reports are configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️ DMARC reports are not configured!" -ForegroundColor Yellow
        Write-Host "Consider adding 'rua=mailto:admin@$Domain' to receive reports."
    }
}
Write-Host ""

# Additional checks
Write-Host "Performing additional checks..." -ForegroundColor Yellow

# Check MX records
$MxRecords = Get-DnsRecord -Domain $Domain -RecordType "MX"
if (-not $MxRecords) {
    Write-Host "⚠️ No MX records found for $Domain" -ForegroundColor Yellow
    Write-Host "If you plan to receive email on this domain, you should set up MX records."
} else {
    Write-Host "✓ MX records found:" -ForegroundColor Green
    $MxRecords | ForEach-Object {
        Write-Host "$($_.NameExchange) (Preference: $($_.Preference))"
    }
}
Write-Host ""

# Summary
Write-Host "=== Email Authentication Summary ===" -ForegroundColor Yellow
if (-not $SpfRecord -or -not $DkimRecord -or -not $DmarcRecord) {
    Write-Host "⚠️ Your email authentication setup is incomplete." -ForegroundColor Yellow
    Write-Host "Complete the missing records to improve email deliverability."
} else {
    Write-Host "✓ Basic email authentication is set up for $Domain" -ForegroundColor Green
    Write-Host "Monitor your email deliverability and DMARC reports for any issues."
}

Write-Host ""
Write-Host "For detailed setup instructions, refer to server/docs/email_authentication_setup.md"
Write-Host ""
Write-Host "To test your email authentication completely, send a test email and check it with:"
Write-Host "- https://www.mail-tester.com/"
Write-Host "- https://mxtoolbox.com/dmarc.aspx"
Write-Host "- https://dmarcian.com/dmarc-inspector/"