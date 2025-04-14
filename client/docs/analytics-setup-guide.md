# Analytics Setup Guide

This guide walks you through setting up analytics and creating a comprehensive dashboard to visualize your website's performance.

## Step 1: Set Up Google Analytics 4

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use an existing one
3. Create a new property and select "Web"
4. Enter your website URL and name
5. Get your Measurement ID (format: G-XXXXXXXXXX)
6. Replace the placeholder in `Analytics.jsx` with your actual Measurement ID:
   ```jsx
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
   ```

## Step 2: Set Up Google Tag Manager (Optional but Recommended)

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account and container
3. Get your GTM ID (format: GTM-XXXXXXX)
4. Replace the placeholder in `Analytics.jsx` with your actual GTM ID:
   ```jsx
   'https://www.googletagmanager.com/gtm.js?id='+i+dl;
   ```
   
## Step 3: Create a Looker Studio Dashboard

1. Go to [Looker Studio](https://lookerstudio.google.com/)
2. Click "Create" → "Report"
3. Connect to your Google Analytics 4 data source
4. Create the following report pages:

### Overview Page
- Add date range selector
- Add metrics summary (Users, Sessions, Engagement Rate)
- Add line chart for users over time
- Add country/region map

### Audience Page
- User demographics (if available)
- Device breakdown
- Browser usage
- New vs. returning users

### Behavior Page
- Most visited pages
- Average engagement time
- Events triggered
- Entry and exit pages

### Performance Page
- Core Web Vitals metrics (LCP, FID, CLS)
- Page load time
- First contentful paint
- Bounce rate correlation

### Technical Page
- Device category breakdown
- Browser versions
- Screen resolutions
- Network information

## Step 4: Set Up Automated Reporting

1. In Looker Studio, click "Schedule email delivery"
2. Set up a weekly or monthly report
3. Add your email address
4. Customize the email subject and message
5. Click "Schedule"

## Step 5: Add Custom Events (For Future Use)

For specific user interactions you want to track:

```javascript
// Track a specific event
window.gtag('event', 'download_resume', {
  'event_category': 'engagement',
  'event_label': 'resume_download'
});

// Track form submissions
window.gtag('event', 'form_submit', {
  'event_category': 'engagement',
  'event_label': 'contact_form'
});
```

## Viewing Your Dashboard

1. Access your dashboard anytime at Looker Studio
2. Allow 24-48 hours for initial data to populate
3. Customize the dashboard as needed

## Best Practices

1. Check your dashboard weekly to identify trends
2. Set up alerts for significant changes in traffic or performance
3. Use insights to guide content and performance improvements
4. Test different CTAs and layouts to improve engagement

## Troubleshooting

If you don't see data in your reports:
1. Ensure the Analytics code is properly deployed
2. Check for ad blockers or privacy extensions
3. Verify your own visits aren't filtered (use IP exclusion)
4. Use the Real-Time reports in Google Analytics to verify tracking