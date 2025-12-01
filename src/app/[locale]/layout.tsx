import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ConditionalNavbar, { ConditionalFooter } from '@/components/ConditionalNavbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { generateOrganizationStructuredData } from '@/lib/structured-data';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
        ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
        : 'https://www.tasami.co';
    
    const isArabic = locale === 'ar';
    
    return {
        title: {
            default: isArabic 
                ? "تسامي - نحو عالم رقمي بلا حدود"
                : "Tasami - Towards a Limitless Digital World",
            template: isArabic 
                ? "%s | تسامي"
                : "%s | Tasami"
        },
        description: isArabic
            ? "شركة تقنية رائدة متخصصة في الذكاء الاصطناعي والأتمتة والتصميم وواجهات المستخدم وحلول التسويق. حول عملك بتقنيات متطورة."
            : "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions. Transform your business with cutting-edge technology.",
        keywords: isArabic
            ? ["ذكاء اصطناعي", "أتمتة", "تصميم", "تسويق", "حلول تقنية", "تطوير برمجيات"]
            : ["AI", "automation", "design", "marketing", "tech solutions", "software development", "UX/UI"],
        authors: [{ name: "Tasami" }],
        creator: "Tasami",
        publisher: "Tasami",
        metadataBase: new URL(baseUrl),
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                'en': `${baseUrl}/en`,
                'ar': `${baseUrl}/ar`,
            },
        },
        openGraph: {
            type: 'website',
            locale: isArabic ? 'ar_SA' : 'en_US',
            url: `${baseUrl}/${locale}`,
            siteName: 'Tasami',
            title: isArabic 
                ? "تسامي - نحو عالم رقمي بلا حدود"
                : "Tasami - Towards a Limitless Digital World",
            description: isArabic
                ? "شركة تقنية رائدة متخصصة في الذكاء الاصطناعي والأتمتة والتصميم وواجهات المستخدم وحلول التسويق."
                : "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions.",
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
            title: isArabic 
                ? "تسامي - نحو عالم رقمي بلا حدود"
                : "Tasami - Towards a Limitless Digital World",
            description: isArabic
                ? "شركة تقنية رائدة متخصصة في الذكاء الاصطناعي والأتمتة والتصميم وواجهات المستخدم وحلول التسويق."
                : "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions.",
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
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    // Validate that the incoming `locale` parameter is valid BEFORE trying to import
    if (!locale || !routing.locales.includes(locale as 'en' | 'ar')) {
        notFound();
    }

    // Load the correct messages based on locale
    const messages = await import(`../../messages/${locale}.json`);

    // Determine text direction based on locale
    const direction = locale === 'ar' ? 'rtl' : 'ltr';
    const baseUrl = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
        ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
        : 'https://www.tasami.co';

    // Generate organization structured data
    const organizationStructuredData = generateOrganizationStructuredData(baseUrl);

    // Get API domain for resource hints
    const apiDomain = process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN 
        ? `https://${process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN}`
        : null;

    return (
        <>
            {/* Resource Hints for Performance */}
            {apiDomain && (
                <>
                    <link rel="preconnect" href={apiDomain} />
                    <link rel="dns-prefetch" href={apiDomain} />
                </>
            )}
            {/* Preconnect to same-origin API */}
            <link rel="preconnect" href="/" />
            {/* DNS prefetch for external resources */}
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
            
            {/* Poppins Font from Google Fonts */}
            <link
                rel="preconnect"
                href="https://fonts.googleapis.com"
            />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="anonymous"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap"
                rel="stylesheet"
            />
            {locale === 'ar' && (
                <>
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
                </>
            )}
            
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        document.documentElement.setAttribute('lang', '${locale}');
                        document.documentElement.setAttribute('dir', '${direction}');
                    `,
                }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationStructuredData),
                }}
            />
            <ErrorBoundary>
            <NextIntlClientProvider locale={locale} messages={messages.default}>
                <ConditionalNavbar />
                {children}
                <ConditionalFooter />
            </NextIntlClientProvider>
            </ErrorBoundary>
        </>
    );
}
