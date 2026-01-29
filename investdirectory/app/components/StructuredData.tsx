export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Termifi",
    "alternateName": "GetTermfi",
    "url": "https://www.gettermfi.com",
    "description": "AI-powered contract intelligence platform for asset managers. Centralize LP agreements, automate contract extraction, and gain instant insights.",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Contact for pricing"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "ratingCount": "1"
    },
    "featureList": [
      "Centralized Repository",
      "AI-Driven Clause Extraction",
      "Smart Alerts",
      "Controlled Access",
      "Contract Intelligence",
      "LP Agreement Management"
    ],
    "audience": {
      "@type": "Audience",
      "audienceType": "Asset Managers, Legal Teams, Compliance Officers"
    }
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Termifi",
    "alternateName": "GetTermfi",
    "url": "https://www.gettermfi.com",
    "logo": "https://www.gettermfi.com/favicon.svg",
    "description": "Contract intelligence platform built for asset managers",
    "sameAs": [
      "https://www.linkedin.com/company/termifi"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Sales",
      "url": "https://www.gettermfi.com/#contact"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
    </>
  );
}
