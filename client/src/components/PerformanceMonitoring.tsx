import { useEffect } from 'react';
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

// Interface for web vitals metric
interface MetricProps {
  name: string;
  value: number;
  id: string;
  delta: number;
}

type MetricReporterFunction = (metric: MetricProps) => void;

// Function to report metrics to the analytics service
const reportMetric: MetricReporterFunction = (metric) => {
  // If using Plausible Analytics
  const plausible = (window as any).plausible;
  
  if (plausible) {
    // Report the metric as a custom event
    plausible('webvital', {
      props: {
        metric: metric.name,
        value: Math.round(metric.value),
        id: metric.id
      }
    });
  }
  
  // Console log metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, {
      value: Math.round(metric.value),
      delta: Math.round(metric.delta),
      id: metric.id
    });
  }
};

const PerformanceMonitoring = () => {
  useEffect(() => {
    // Register web-vitals reporting
    getCLS(reportMetric);    // Cumulative Layout Shift
    getFID(reportMetric);    // First Input Delay
    getLCP(reportMetric);    // Largest Contentful Paint
    getFCP(reportMetric);    // First Contentful Paint
    getTTFB(reportMetric);   // Time to First Byte
  }, []);

  // This component doesn't render anything visible
  return null;
};

export default PerformanceMonitoring;