/**
 * Environment configuration
 * This centralizes all environment variables and provides defaults
 */

// Site configuration
export const config = {
  // Analytics IDs
  analytics: {
    gaId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
    gtmId: import.meta.env.VITE_GTM_ID || '',
    enabled: import.meta.env.PROD || import.meta.env.VITE_ENABLE_ANALYTICS === 'true'
  },
  
  // Site information
  site: {
    url: import.meta.env.VITE_SITE_URL || 'https://rick-learns.dev',
    name: 'Rick Cohen Portfolio',
    title: 'Rick Cohen | Quality Engineer & Learning Developer',
    description: 'Portfolio of Rick Cohen, a Quality Engineer & Developer with expertise in GoLang, Swift, PowerShell, Bash, React, and more.',
    previewImage: '/assets/portfolio-preview.png'
  },
  
  // Environment
  environment: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
  }
};

export default config;