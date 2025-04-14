import { useEffect } from 'react';
import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

// Function to send metrics to Google Analytics
const sendToGoogleAnalytics = ({ name, delta, value, id }) => {
  // Assumes window.gtag is available
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta), // CLS needs special handling
      non_interaction: true, // Prevents this from affecting bounce rate
      metric_id: id, // Unique identifier for the metric
      metric_value: value, // The actual value of the metric
      metric_delta: delta, // The change in the metric
    });
  }
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${name}`, {
      value: Math.round(value),
      delta: Math.round(delta),
      id: id
    });
  }
};

const PerformanceMonitoring = () => {
  useEffect(() => {
    // Register analytics callback for Core Web Vitals
    onCLS(sendToGoogleAnalytics);
    onFID(sendToGoogleAnalytics);
    onLCP(sendToGoogleAnalytics);
    onFCP(sendToGoogleAnalytics);
    onTTFB(sendToGoogleAnalytics);
  }, []);

  return null;
};

export default PerformanceMonitoring;