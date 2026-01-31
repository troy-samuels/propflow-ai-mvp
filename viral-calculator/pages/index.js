import React from 'react';
import Head from 'next/head';
import BlendedIndependenceCalculator from '../components/BlendedIndependenceCalculator';

export default function CalculatorPage() {
  return (
    <>
      <Head>
        <title>Platform Tax Calculator | TutorLingua Independence Tool</title>
        <meta 
          name="description" 
          content="Discover exactly how much platform dependency is costing you annually. Calculate your platform tax and see how much you could earn independently." 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Platform Tax Calculator - Shocking Results!" />
        <meta property="og:description" content="I just calculated my platform tax and was shocked. See how much you're really paying to platforms annually." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://calculator.tutorlingua.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Platform Tax Calculator - Calculate Your Annual Platform Fees" />
        <meta name="twitter:description" content="Discover how much platform dependency is costing you. The results will shock you." />
        
        {/* Google Fonts for TutorLingua brand consistency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=DM+Serif+Display:wght@400;700&display=swap" 
          rel="stylesheet" 
        />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        
        {/* Analytics */}
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <script 
              async 
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
                `
              }}
            />
          </>
        )}
      </Head>
      
      <BlendedIndependenceCalculator />
      
      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Platform Tax Calculator",
            "description": "Calculate exactly how much platform dependency is costing language tutors annually",
            "url": "https://calculator.tutorlingua.com",
            "creator": {
              "@type": "Organization",
              "name": "TutorLingua",
              "url": "https://tutorlingua.com"
            },
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
    </>
  );
}