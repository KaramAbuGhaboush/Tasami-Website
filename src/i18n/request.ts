import { getRequestConfig } from 'next-intl/server';

// Default locale - actual locale will be determined client-side from sessionStorage
const DEFAULT_LOCALE = 'en';

export default getRequestConfig(async () => {
    // Always return default locale for server-side rendering
    // Client-side will override this using the LanguageContext
    return {
        locale: DEFAULT_LOCALE,
        messages: (await import(`../messages/${DEFAULT_LOCALE}.json`)).default,
        timeZone: 'UTC' // Set default timezone to avoid markup mismatches
    };
});
