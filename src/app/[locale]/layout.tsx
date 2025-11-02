import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import ConditionalNavbar, { ConditionalFooter } from '@/components/ConditionalNavbar';

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export function generateMetadata(): Metadata {
    return {
        title: "Tasami - AI, Automation, Design & Marketing Solutions",
        description: "Leading tech company specializing in AI, automation, design, UX/UI, and marketing solutions. Transform your business with cutting-edge technology.",
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

    return (
        <>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        document.documentElement.setAttribute('lang', '${locale}');
                        document.documentElement.setAttribute('dir', '${direction}');
                    `,
                }}
            />
            <NextIntlClientProvider locale={locale} messages={messages.default}>
                <ConditionalNavbar />
                {children}
                <ConditionalFooter />
            </NextIntlClientProvider>
        </>
    );
}
