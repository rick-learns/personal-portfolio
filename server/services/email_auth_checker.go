package services

import (
	"fmt"
	"net"
	"strings"
)

// EmailAuthCheck contains the results of checking email authentication setup
type EmailAuthCheck struct {
	Domain     string `json:"domain"`
	SPFFound   bool   `json:"spf_found"`
	SPFRecord  string `json:"spf_record,omitempty"`
	DKIMFound  bool   `json:"dkim_found"`
	DKIMRecord string `json:"dkim_record,omitempty"`
	DMARCFound bool   `json:"dmarc_found"`
	DMARCRecord string `json:"dmarc_record,omitempty"`
	MXFound    bool   `json:"mx_found"`
	MXRecords  []string `json:"mx_records,omitempty"`
	IsComplete bool   `json:"is_complete"`
	Recommendations []string `json:"recommendations,omitempty"`
}

// EmailAuthChecker provides functionality to check email authentication setup
type EmailAuthChecker struct{}

// NewEmailAuthChecker creates a new email authentication checker
func NewEmailAuthChecker() *EmailAuthChecker {
	return &EmailAuthChecker{}
}

// CheckDomain performs a comprehensive check of email authentication for a domain
func (e *EmailAuthChecker) CheckDomain(domain string) (*EmailAuthCheck, error) {
	result := &EmailAuthCheck{
		Domain: domain,
		Recommendations: []string{},
	}
	
	// Check SPF record
	spfRecords, err := net.LookupTXT(domain)
	if err == nil {
		for _, record := range spfRecords {
			if strings.HasPrefix(record, "v=spf1") {
				result.SPFFound = true
				result.SPFRecord = record
				
				// Check if Resend is included in SPF
				if !strings.Contains(record, "include:spf.resend.com") {
					result.Recommendations = append(
						result.Recommendations,
						"Add 'include:spf.resend.com' to your SPF record to authorize Resend to send emails",
					)
				}
				break
			}
		}
	}
	
	if !result.SPFFound {
		result.Recommendations = append(
			result.Recommendations,
			"Add an SPF record (e.g., 'v=spf1 include:spf.resend.com -all') to your domain's DNS",
		)
	}
	
	// Check DKIM record
	dkimDomain := fmt.Sprintf("resend._domainkey.%s", domain)
	dkimRecords, err := net.LookupTXT(dkimDomain)
	if err == nil && len(dkimRecords) > 0 {
		result.DKIMFound = true
		result.DKIMRecord = dkimRecords[0]
	} else {
		result.Recommendations = append(
			result.Recommendations,
			"Add a DKIM record for 'resend._domainkey' subdomain with the value provided by Resend",
		)
	}
	
	// Check DMARC record
	dmarcDomain := fmt.Sprintf("_dmarc.%s", domain)
	dmarcRecords, err := net.LookupTXT(dmarcDomain)
	if err == nil && len(dmarcRecords) > 0 {
		result.DMARCFound = true
		result.DMARCRecord = dmarcRecords[0]
		
		// Check DMARC policy
		if strings.Contains(dmarcRecords[0], "p=none") {
			result.Recommendations = append(
				result.Recommendations,
				"Consider upgrading your DMARC policy from 'none' to 'quarantine' or 'reject' after testing",
			)
		}
		
		// Check for reporting
		if !strings.Contains(dmarcRecords[0], "rua=mailto:") {
			result.Recommendations = append(
				result.Recommendations,
				fmt.Sprintf("Configure DMARC reporting by adding 'rua=mailto:admin@%s' to your DMARC record", domain),
			)
		}
	} else {
		result.Recommendations = append(
			result.Recommendations,
			fmt.Sprintf("Add a DMARC record (e.g., 'v=DMARC1; p=quarantine; rua=mailto:admin@%s; pct=100')", domain),
		)
	}
	
	// Check MX records
	mxRecords, err := net.LookupMX(domain)
	if err == nil && len(mxRecords) > 0 {
		result.MXFound = true
		for _, mx := range mxRecords {
			result.MXRecords = append(result.MXRecords, mx.Host)
		}
	} else {
		result.Recommendations = append(
			result.Recommendations,
			"If you plan to receive email on this domain, set up MX records",
		)
	}
	
	// Check if the setup is complete
	result.IsComplete = result.SPFFound && result.DKIMFound && result.DMARCFound
	
	return result, nil
}