import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { IntlProvider } from '@/components/IntlProvider';
import { MetadataUpdater } from '@/components/MetadataUpdater';
import { ToastProvider } from '@/components/ui/toast';
import { AlertProvider } from '@/components/ui/alert-dialog';
import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
  ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
  : 'https://www.tasami.co';

export const metadata: Metadata = {
  title: {
    default: "Tasami - AI, Automation, Design & Marketing Solutions",
    template: "%s | Tasami"
  },
  description: "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions. Transform your business with cutting-edge technology.",
  keywords: ["AI", "automation", "design", "marketing", "tech solutions", "software development", "UX/UI"],
  authors: [{ name: "Tasami" }],
  creator: "Tasami",
  publisher: "Tasami",
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: baseUrl,
    languages: {
      'en': baseUrl,
      'ar': baseUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Tasami',
    title: "Tasami - AI, Automation, Design & Marketing Solutions",
    description: "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions.",
    images: [
      {
        url: `${baseUrl}/Logo.png`,
        width: 1200,
        height: 630,
        alt: 'Tasami Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Tasami - AI, Automation, Design & Marketing Solutions",
    description: "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions.",
    images: [`${baseUrl}/Logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="/" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/Font/ROCK.TTF"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Font/Rockwell-Bold.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Font/Hacen-Algeria.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/Font/Hacen-Algeria-Bd.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <IntlProvider>
            <MetadataUpdater />
            <AuthProvider>
              <ToastProvider>
                <AlertProvider>
                  {children}
                </AlertProvider>
              </ToastProvider>
            </AuthProvider>
          </IntlProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
