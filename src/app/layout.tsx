import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/contexts/AuthContext";
import FacebookSDK from "@/components/FacebookSDK";
import "./globals.css";

const SITE_URL = "https://nepalchunab.xyz";
const SITE_NAME = "Nepal Election 2026";
const DESCRIPTION =
  "Track Nepal's 2026 general election — interactive map of all 77 districts, 165 constituencies, candidates, party results & live updates. नेपाल चुनाव २०८२ | Nepal Chunab 2082 BS";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Election 2026 (चुनाव २०८२) — Interactive Map & Prediction",
    template: "%s | Nepal Election 2026",
  },
  description: DESCRIPTION,
  keywords: [
    // English keywords
    "Nepal election 2026",
    "Nepal general election",
    "Nepal election results",
    "Nepal election candidates",
    "Nepal election map",
    "Nepal constituency map",
    "Nepal election zones",
    "Nepal FPTP results",
    "Nepal election tracker",
    "Nepal election 2026 candidates",
    "Nepal election 2026 results",
    "KP Oli",
    "Rabi Lamichhane",
    "Balen Shah",
    "Sher Bahadur Deuba",
    "Pushpa Kamal Dahal",
    "Prachanda",
    "Baburam Bhattarai",
    "Nepali Congress",
    "CPN-UML",
    "CPN Maoist Centre",
    "Rastriya Swatantra Party",
    "RSP Nepal",
    "Rastriya Prajatantra Party",
    "Nepal parliament election",
    "Nepal pratinidhi sabha",
    "Nepal House of Representatives",
    // Nepali / Romanized keywords
    "नेपाल चुनाव",
    "नेपाल निर्वाचन २०८२",
    "चुनाव २०८२",
    "nepal chunab",
    "nepal nirbachan 2082",
    "chunab 2082",
    "nepal ko chunab",
    "pratinidhi sabha nirbachan",
    "nepal election date",
    "nepal chunab 2026",
    "nepal election live",
    "nepal election update",
    "nepal chunab result",
    // District keywords
    "Kathmandu election",
    "Lalitpur election",
    "Pokhara election",
    "Chitwan election",
    "Jhapa election",
    "Morang election",
    "Rupandehi election",
  ],
  authors: [{ name: "Nepal Election Tracker Team" }],
  creator: "Nepal Election 2026",
  publisher: "Nepal Election 2026",
  category: "Politics",
  classification: "Election Tracker",

  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "ne_NP",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Election 2026 (चुनाव २०८२) — Interactive Map & Prediction",
    description:
      "Track all 77 districts, 165 election zones, and 658+ candidates for Nepal's 2026 election. Interactive map with 2022 results & live updates. नेपाल चुनाव ट्र्याकर",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Nepal Election 2026 - Interactive Election Zone Tracker Map",
        type: "image/png",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Election 2026 (चुनाव २०८२) — Interactive Map & Prediction",
    description:
      "Track Nepal's 2026 election across 77 districts & 165 zones. See candidates, 2022 results & live updates. नेपाल चुनाव २०८२",
    images: [`${SITE_URL}/opengraph-image`],
    creator: "@nepalelection",
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your real IDs later)
  // verification: {
  //   google: "your-google-verification-code",
  // },

  // Alternates
  alternates: {
    canonical: SITE_URL,
  },

  // Icons
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // App info
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Nepal Election 2026 Tracker",
    alternateName: ["नेपाल चुनाव २०८२", "Nepal Chunab 2082", "Nepal Nirbachan 2082"],
    url: SITE_URL,
    description: DESCRIPTION,
    applicationCategory: "Politics",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "NPR",
    },
    author: {
      "@type": "Organization",
      name: "Nepal Election Tracker",
    },
    datePublished: "2026-02-01",
    inLanguage: ["en", "ne"],
    about: {
      "@type": "Event",
      name: "Nepal General Election 2026",
      alternateName: "नेपाल आम निर्वाचन २०८२",
      startDate: "2026-03-05",
      location: {
        "@type": "Country",
        name: "Nepal",
      },
      description:
        "Nepal's general election for the House of Representatives (Pratinidhi Sabha) scheduled for March 5, 2026 (Falgun 21, 2082 BS)",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "When is the Nepal election 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepal's general election is scheduled for Thursday, March 5, 2026 (Falgun 21, 2082 BS).",
        },
      },
      {
        "@type": "Question",
        name: "How many election districts are there in Nepal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nepal has 77 districts across 7 provinces, with 165 FPTP constituencies (election zones) for the House of Representatives.",
        },
      },
      {
        "@type": "Question",
        name: "How many candidates are contesting in Nepal election 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Over 658 candidates have filed for the 2026 election across 165 constituencies in 77 districts.",
        },
      },
      {
        "@type": "Question",
        name: "Which parties are contesting Nepal election 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Major parties include Nepali Congress, CPN-UML, CPN (Maoist Centre), Rastriya Swatantra Party (RSP), Rastriya Prajatantra Party (RPP), Janata Samajwadi Party, and several other parties.",
        },
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-T4YZLTLZVS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-T4YZLTLZVS');
          `}
        </Script>

        {/* Facebook Login SDK — loaded via client component for onLoad handler */}

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased">
        <FacebookSDK />
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
