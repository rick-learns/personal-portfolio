import React from 'react';
import { Helmet } from 'react-helmet-async';

// Get site URL from environment variables
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://rick-learns.dev';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Rick Cohen | Quality Engineer & Learning Developer",
  description = "Portfolio of Rick Cohen, a Quality Engineer & Developer with expertise in GoLang, Swift, PowerShell, Bash, React, and more. View projects and experience.",
  canonicalUrl = SITE_URL,
  ogImage = `${SITE_URL}/assets/portfolio-preview.png`
}) => {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

export default SEO;