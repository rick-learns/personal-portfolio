import React from 'react';
import { Helmet } from 'react-helmet-async';
import { developerInfo } from '@/lib/data';

// Get site URL from environment variables
const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://rick-learns.dev';

const StructuredData = () => {
  // Person schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: developerInfo.name,
    jobTitle: developerInfo.title,
    email: developerInfo.email,
    url: SITE_URL,
    sameAs: developerInfo.socials.map(social => social.url)
  };

  // Professional service schema
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: `${developerInfo.name} - ${developerInfo.title}`,
    description: 'Quality Engineer & Developer specializing in automation, testing, and tool development.',
    url: SITE_URL,
    email: developerInfo.email,
    founder: {
      '@type': 'Person',
      name: developerInfo.name
    },
    knowsAbout: ['GoLang', 'Swift', 'PowerShell', 'Bash', 'React', 'TypeScript', 'Quality Assurance']
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(personSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(serviceSchema)}
      </script>
    </Helmet>
  );
};

export default StructuredData;