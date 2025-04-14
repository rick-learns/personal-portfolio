import React, { useEffect } from 'react';
import { useLocation } from 'wouter';

// Type definition for window.gtag
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Get values from environment variables
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-2WSTR230D3';
const GTM_ID = import.meta.env.VITE_GTM_ID;

// Only run analytics in production unless explicitly enabled in development
const enableAnalytics = import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true';

const Analytics: React.FC = () => {
  const [location] = useLocation();

  // Load Google Analytics
  useEffect(() => {
    // Skip in development unless explicitly enabled
    if (!enableAnalytics) {
      console.log('Analytics disabled in development. Set VITE_ENABLE_ANALYTICS=true to enable.');
      return;
    }

    // Google Analytics script
    const loadGA = () => {
      const scriptGA = document.createElement('script');
      scriptGA.async = true;
      scriptGA.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(scriptGA);

      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any[]) { 
        window.dataLayer.push(arguments); 
      }
      // @ts-ignore - gtag function has complex typing
      window.gtag = gtag;
      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location,
        anonymize_ip: true,
      });
    };

    // Google Tag Manager script (only if ID is provided)
    const loadGTM = () => {
      const scriptGTM = document.createElement('script');
      scriptGTM.innerHTML = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
      `;
      document.head.appendChild(scriptGTM);

      // GTM NoScript fallback
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`;
      iframe.height = "0";
      iframe.width = "0";
      iframe.style.display = "none";
      iframe.style.visibility = "hidden";
      noscript.appendChild(iframe);
      document.body.appendChild(noscript);
    };

    // Load Google Analytics first (always)
    if (GA_MEASUREMENT_ID && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      loadGA();
    }
    
    // Load GTM only if ID is provided and valid
    if (GTM_ID && GTM_ID !== 'GTM-XXXXXXX' && GTM_ID !== '') {
      loadGTM();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  // Track page views when location changes
  useEffect(() => {
    if (enableAnalytics && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location,
      });
    }
  }, [location]);

  return null;
};

export default Analytics;