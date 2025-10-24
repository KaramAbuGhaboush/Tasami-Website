# Arabic Language Implementation Plan with Frontend Translation
## Step-by-Step Instructions for AI Assistant

## Overview
This plan implements Arabic language support for the Tasami website using NextIntl for static content and frontend translation for dynamic content, excluding admin, login, and employee pages. All translation happens on the frontend after fetching data from the backend.

## Implementation Instructions for AI Assistant

Follow these steps in order to implement Arabic language support with auto-translation. Each step includes specific file paths, code changes, and verification steps.

---

## Phase 1: Setup and Infrastructure

### Step 1.1: Install Required Dependencies

**Action**: Install NextIntl and choose a free translation solution
**Files to modify**: `package.json`

**Instructions**:
1. Run these commands in the root directory:
```bash
npm install next-intl
```

**Choose ONE of these free translation options:**

**Option A: LibreTranslate (Self-hosted, 100% free)**
```bash
# No additional packages needed - use fetch API
```

**Option B: Yandex Translate (Free tier)**
```bash
# No additional packages needed - use fetch API
```

**Option C: MyMemory API (Free tier)**
```bash
# No additional packages needed - use fetch API
```

**Verification**: Check that next-intl is added to package.json

---

### Step 1.2: Environment Variables Setup

**Action**: Create environment files for language and translation configuration
**Files to create**: `.env.local`

**Instructions**:
1. Create `.env.local` in root directory with:

**For LibreTranslate (Option A - Recommended):**
```env
# Language Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar

# LibreTranslate Configuration (self-hosted)
NEXT_PUBLIC_LIBRETRANSLATE_URL=http://localhost:5000
NEXT_PUBLIC_AUTO_TRANSLATE_ENABLED=true
```

**For Yandex Translate (Option B):**
```env
# Language Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar

# Yandex Translate Configuration
NEXT_PUBLIC_YANDEX_API_KEY=your_yandex_api_key
NEXT_PUBLIC_AUTO_TRANSLATE_ENABLED=true
```

**For MyMemory API (Option C):**
```env
# Language Configuration
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_SUPPORTED_LOCALES=en,ar

# MyMemory API Configuration (no API key needed)
NEXT_PUBLIC_MYMEMORY_EMAIL=your_email@example.com
NEXT_PUBLIC_AUTO_TRANSLATE_ENABLED=true
```

**Verification**: File exists and contains the required environment variables

---

### Step 1.3: Next.js Configuration

**Action**: Update Next.js config for internationalization
**Files to modify**: `next.config.ts`

**Instructions**:
1. Read the current `next.config.ts` file
2. Update it to include next-intl plugin:
```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  // ... existing config
};

export default withNextIntl(nextConfig);
```

**Verification**: Next.js config includes next-intl plugin

---

### Step 1.4: Create NextIntl Configuration

**Action**: Create NextIntl configuration file
**Files to create**: `src/i18n.ts`

**Instructions**:
1. Create the NextIntl configuration file
2. Set up locale detection and routing
3. Configure message loading

**Code to implement**:
```typescript
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
const locales = ['en', 'ar'];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`../locales/${locale}.json`)).default
  };
});
```

**Verification**: File created with proper locale configuration

---

### Step 1.5: Create Free Frontend Translation Service

**Action**: Create frontend translation service using free APIs
**Files to create**: `src/lib/frontendTranslation.ts`

**Instructions**:
1. Create frontend translation service with multiple free API options
2. Include methods for translating different content types
3. Add caching and error handling

**Code to implement**:
```typescript
class FrontendTranslationService {
  private cache: Map<string, string> = new Map();

  async translateText(text: string, targetLanguage: string = 'ar'): Promise<string> {
    try {
      if (!text || text.trim() === '') return text;
      
      // Check cache first
      const cacheKey = `${text}_${targetLanguage}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }
      
      let translation: string;
      
      // Try different free APIs in order of preference
      if (process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL) {
        translation = await this.translateWithLibreTranslate(text, targetLanguage);
      } else if (process.env.NEXT_PUBLIC_YANDEX_API_KEY) {
        translation = await this.translateWithYandex(text, targetLanguage);
      } else {
        translation = await this.translateWithMyMemory(text, targetLanguage);
      }
      
      // Cache the result
      this.cache.set(cacheKey, translation);
      
      return translation;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text if translation fails
    }
  }

  // LibreTranslate (Self-hosted, 100% free)
  private async translateWithLibreTranslate(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: targetLanguage,
        format: 'text'
      })
    });

    if (!response.ok) {
      throw new Error('LibreTranslate API error');
    }

    const data = await response.json();
    return data.translatedText;
  }

  // Yandex Translate (Free tier: 10M characters/month)
  private async translateWithYandex(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch('https://translate.yandex.net/api/v1.5/tr.json/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        key: process.env.NEXT_PUBLIC_YANDEX_API_KEY!,
        text: text,
        lang: `en-${targetLanguage}`,
        format: 'plain'
      })
    });

    if (!response.ok) {
      throw new Error('Yandex Translate API error');
    }

    const data = await response.json();
    return data.text[0];
  }

  // MyMemory API (Free tier: 1000 requests/day)
  private async translateWithMyMemory(text: string, targetLanguage: string): Promise<string> {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}&de=${process.env.NEXT_PUBLIC_MYMEMORY_EMAIL}`
    );

    if (!response.ok) {
      throw new Error('MyMemory API error');
    }

    const data = await response.json();
    return data.responseData.translatedText;
  }

  async translateObject(obj: any, targetLanguage: string = 'ar'): Promise<any> {
    const translated = { ...obj };
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string' && value.trim() !== '') {
        translated[key] = await this.translateText(value, targetLanguage);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await this.translateObject(value, targetLanguage);
      }
    }
    
    return translated;
  }

  async translateArray(arr: any[], targetLanguage: string = 'ar'): Promise<any[]> {
    return Promise.all(
      arr.map(item => 
        typeof item === 'string' 
          ? this.translateText(item, targetLanguage)
          : this.translateObject(item, targetLanguage)
      )
    );
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }
}

export const frontendTranslationService = new FrontendTranslationService();
```

**Verification**: File created with multiple free translation API options

---

### Step 1.6: Setup LibreTranslate (Recommended Free Option)

**Action**: Set up LibreTranslate for self-hosted translation
**Instructions**: Choose this option for 100% free translation

**Option A: Docker Setup (Easiest)**
```bash
# Install Docker if not already installed
# Then run LibreTranslate
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```

**Option B: Python Setup**
```bash
# Install Python 3.8+
pip install libretranslate
libretranslate --host 0.0.0.0 --port 5000
```

**Option C: Use Public Instance**
```env
# Use a public LibreTranslate instance (less reliable)
NEXT_PUBLIC_LIBRETRANSLATE_URL=https://libretranslate.de
```

**Verification**: LibreTranslate is running on http://localhost:5000

---

## Phase 2: Frontend Translation Hooks

### Step 2.1: Create Translation Hooks

**Action**: Create React hooks for frontend translation
**Files to create**: `src/hooks/useTranslation.ts`

**Instructions**:
1. Create custom hooks for translating content
2. Include caching and loading states
3. Add error handling

**Code to implement**:
```typescript
import { useState, useEffect, useCallback } from 'react';
import { frontendTranslationService } from '@/lib/frontendTranslation';

export function useTranslation() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const translateText = useCallback(async (text: string, targetLanguage: string = 'ar') => {
    if (!text || text.trim() === '') return text;
    
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      const translated = await frontendTranslationService.translateText(text, targetLanguage);
      return translated;
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'Translation failed');
      return text; // Return original text on error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateObject = useCallback(async (obj: any, targetLanguage: string = 'ar') => {
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      const translated = await frontendTranslationService.translateObject(obj, targetLanguage);
      return translated;
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'Translation failed');
      return obj; // Return original object on error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateArray = useCallback(async (arr: any[], targetLanguage: string = 'ar') => {
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      const translated = await frontendTranslationService.translateArray(arr, targetLanguage);
      return translated;
    } catch (error) {
      setTranslationError(error instanceof Error ? error.message : 'Translation failed');
      return arr; // Return original array on error
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translateText,
    translateObject,
    translateArray,
    isTranslating,
    translationError,
    clearError: () => setTranslationError(null)
  };
}

// Hook for translating specific content types
export function useContentTranslation() {
  const { translateText, translateObject, isTranslating, translationError } = useTranslation();

  const translateBlogArticle = useCallback(async (article: any, targetLanguage: string = 'ar') => {
    const translated = { ...article };
    
    if (article.title) {
      translated.title = await translateText(article.title, targetLanguage);
    }
    if (article.excerpt) {
      translated.excerpt = await translateText(article.excerpt, targetLanguage);
    }
    if (article.content) {
      translated.content = await translateText(article.content, targetLanguage);
    }
    if (article.tags && Array.isArray(article.tags)) {
      translated.tags = await Promise.all(
        article.tags.map((tag: string) => translateText(tag, targetLanguage))
      );
    }
    
    return translated;
  }, [translateText]);

  const translateProject = useCallback(async (project: any, targetLanguage: string = 'ar') => {
    const translated = { ...project };
    
    if (project.title) {
      translated.title = await translateText(project.title, targetLanguage);
    }
    if (project.description) {
      translated.description = await translateText(project.description, targetLanguage);
    }
    if (project.challenge) {
      translated.challenge = await translateText(project.challenge, targetLanguage);
    }
    if (project.solution) {
      translated.solution = await translateText(project.solution, targetLanguage);
    }
    
    return translated;
  }, [translateText]);

  const translateTestimonial = useCallback(async (testimonial: any, targetLanguage: string = 'ar') => {
    const translated = { ...testimonial };
    
    if (testimonial.name) {
      translated.name = await translateText(testimonial.name, targetLanguage);
    }
    if (testimonial.role) {
      translated.role = await translateText(testimonial.role, targetLanguage);
    }
    if (testimonial.company) {
      translated.company = await translateText(testimonial.company, targetLanguage);
    }
    if (testimonial.quote) {
      translated.quote = await translateText(testimonial.quote, targetLanguage);
    }
    
    return translated;
  }, [translateText]);

  return {
    translateBlogArticle,
    translateProject,
    translateTestimonial,
    isTranslating,
    translationError
  };
}
```

**Verification**: Translation hooks created with proper error handling and caching

---

## Phase 3: Update Existing Hooks for Translation

### Step 3.1: Update Blog Hook with Translation

**Action**: Update existing blog hook to support frontend translation
**Files to modify**: `src/hooks/useBlog.ts`

**Instructions**:
1. Read the current blog hook file
2. Add translation functionality using the new translation hooks
3. Add language switching support

**Code changes to implement**:
```typescript
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useContentTranslation } from './useTranslation';
import { apiClient } from '@/lib/api';

export function useBlog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedArticles, setTranslatedArticles] = useState([]);
  const locale = useLocale();
  const { translateBlogArticle, isTranslating, translationError } = useContentTranslation();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getBlogArticles();
        if (response.success) {
          setArticles(response.data);
          
          // Translate articles if Arabic is selected
          if (locale === 'ar') {
            const translated = await Promise.all(
              response.data.map((article: any) => translateBlogArticle(article, 'ar'))
            );
            setTranslatedArticles(translated);
          } else {
            setTranslatedArticles(response.data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [locale, translateBlogArticle]);

  return { 
    articles: translatedArticles, 
    originalArticles: articles,
    loading: loading || isTranslating, 
    error: error || translationError 
  };
}
```

**Verification**: Blog hook supports frontend translation

---

### Step 3.2: Update Projects API

**Action**: Add auto-translation to projects endpoints
**Files to modify**: `backend/src/routes/projects.ts`

**Instructions**:
1. Read the current projects routes file
2. Import the backend translation service
3. Update create project endpoint to include auto-translation
4. Update get projects endpoint to support language parameter

**Code changes to implement**:

Add import at the top:
```typescript
import { backendTranslationService } from '../services/translationService';
```

Update create project endpoint:
```typescript
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = req.body;
    
    const project = await prisma.project.create({
      data: {
        ...projectData,
        translationStatus: 'pending'
      },
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
        contentBlocks: true
      }
    });

    // Auto-translate if enabled
    if (process.env.AUTO_TRANSLATE_ENABLED === 'true') {
      try {
        const translatedData = await backendTranslationService.translateProject(project);
        
        await prisma.project.update({
          where: { id: project.id },
          data: {
            ...translatedData,
            translationStatus: 'completed',
            lastTranslated: new Date()
          }
        });
      } catch (translationError) {
        console.error('Auto-translation failed:', translationError);
      }
    }

    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Update get projects endpoint:
```typescript
app.get('/api/projects', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    const projects = await prisma.project.findMany({
      include: {
        category: true,
        technologies: true,
        results: true,
        clientTestimonial: true,
        contentBlocks: true
      }
    });

    const localizedProjects = projects.map(project => ({
      ...project,
      title: lang === 'ar' ? (project.titleAr || project.title) : project.title,
      description: lang === 'ar' ? (project.descriptionAr || project.description) : project.description,
      challenge: lang === 'ar' ? (project.challengeAr || project.challenge) : project.challenge,
      solution: lang === 'ar' ? (project.solutionAr || project.solution) : project.solution,
      category: {
        ...project.category,
        name: lang === 'ar' ? (project.category.nameAr || project.category.name) : project.category.name,
        description: lang === 'ar' ? (project.category.descriptionAr || project.category.description) : project.category.description
      }
    }));

    res.json({ success: true, data: { projects: localizedProjects } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Verification**: Projects API supports auto-translation and language parameter

---

### Step 3.3: Update Testimonials API

**Action**: Add auto-translation to testimonials endpoints
**Files to modify**: `backend/src/routes/testimonials.ts`

**Instructions**:
1. Read the current testimonials routes file
2. Import the backend translation service
3. Update create testimonial endpoint to include auto-translation
4. Update get testimonials endpoint to support language parameter

**Code changes to implement**:

Add import at the top:
```typescript
import { backendTranslationService } from '../services/translationService';
```

Update create testimonial endpoint:
```typescript
app.post('/api/testimonials', async (req, res) => {
  try {
    const testimonialData = req.body;
    
    const testimonial = await prisma.testimonial.create({
      data: {
        ...testimonialData,
        translationStatus: 'pending'
      }
    });

    // Auto-translate if enabled
    if (process.env.AUTO_TRANSLATE_ENABLED === 'true') {
      try {
        const translatedData = await backendTranslationService.translateTestimonial(testimonial);
        
        await prisma.testimonial.update({
          where: { id: testimonial.id },
          data: {
            ...translatedData,
            translationStatus: 'completed',
            lastTranslated: new Date()
          }
        });
      } catch (translationError) {
        console.error('Auto-translation failed:', translationError);
      }
    }

    res.json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

Update get testimonials endpoint:
```typescript
app.get('/api/testimonials', async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'active' }
    });

    const localizedTestimonials = testimonials.map(testimonial => ({
      ...testimonial,
      name: lang === 'ar' ? (testimonial.nameAr || testimonial.name) : testimonial.name,
      role: lang === 'ar' ? (testimonial.roleAr || testimonial.role) : testimonial.role,
      company: lang === 'ar' ? (testimonial.companyAr || testimonial.company) : testimonial.company,
      quote: lang === 'ar' ? (testimonial.quoteAr || testimonial.quote) : testimonial.quote
    }));

    res.json({ success: true, data: { testimonials: localizedTestimonials } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

**Verification**: Testimonials API supports auto-translation and language parameter

---

## Phase 4: Frontend Implementation

### Step 4.1: Create Translation Files

**Action**: Create translation files for static content
**Files to create**: 
- `src/locales/en/common.json`
- `src/locales/ar/common.json`
- `src/locales/en/home.json`
- `src/locales/ar/home.json`
- `src/locales/en/about.json`
- `src/locales/ar/about.json`
- `src/locales/en/services.json`
- `src/locales/ar/services.json`
- `src/locales/en/work.json`
- `src/locales/ar/work.json`
- `src/locales/en/blog.json`
- `src/locales/ar/blog.json`
- `src/locales/en/contact.json`
- `src/locales/ar/contact.json`

**Instructions**:
1. Create the locales directory structure
2. Create English translation files with all static content
3. Create Arabic translation files with translated content
4. Include navigation, buttons, common text, and page-specific content

**Sample files to create**:

`src/locales/en/common.json`:
```json
{
  "navigation": {
    "home": "Home",
    "about": "About",
    "services": "Services",
    "work": "Work",
    "blog": "Blog",
    "career": "Career",
    "contact": "Contact"
  },
  "buttons": {
    "learnMore": "Learn More",
    "getStarted": "Get Started",
    "readMore": "Read More",
    "viewAll": "View All",
    "submit": "Submit",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "retry": "Retry",
    "back": "Back",
    "next": "Next",
    "previous": "Previous"
  }
}
```

`src/locales/ar/common.json`:
```json
{
  "navigation": {
    "home": "الرئيسية",
    "about": "من نحن",
    "services": "الخدمات",
    "work": "أعمالنا",
    "blog": "المدونة",
    "career": "الوظائف",
    "contact": "اتصل بنا"
  },
  "buttons": {
    "learnMore": "اعرف المزيد",
    "getStarted": "ابدأ الآن",
    "readMore": "اقرأ المزيد",
    "viewAll": "عرض الكل",
    "submit": "إرسال",
    "cancel": "إلغاء",
    "save": "حفظ",
    "edit": "تعديل",
    "delete": "حذف"
  },
  "common": {
    "loading": "جاري التحميل...",
    "error": "حدث خطأ",
    "retry": "إعادة المحاولة",
    "back": "رجوع",
    "next": "التالي",
    "previous": "السابق"
  }
}
```

**Verification**: All translation files created with proper JSON structure

---

### Step 4.2: Create Middleware

**Action**: Create middleware for language detection and routing
**Files to create**: `src/middleware.ts`

**Instructions**:
1. Create middleware file for next-intl
2. Configure locales and pathnames
3. Exclude admin, login, and employee pages

**Code to implement**:
```typescript
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  // Exclude admin, login, and employee pages
  pathnames: {
    '/': '/',
    '/about': {
      en: '/about',
      ar: '/ar/about'
    },
    '/services': {
      en: '/services',
      ar: '/ar/services'
    },
    '/work': {
      en: '/work',
      ar: '/ar/work'
    },
    '/blog': {
      en: '/blog',
      ar: '/ar/blog'
    },
    '/career': {
      en: '/career',
      ar: '/ar/career'
    },
    '/contact': {
      en: '/contact',
      ar: '/ar/contact'
    }
  }
});

export const config = {
  matcher: [
    // Exclude admin, login, employee pages
    '/((?!admin|login|employee|api|_next|_vercel|.*\\..*).*)'
  ]
};
```

**Verification**: Middleware created with proper exclusions

---

### Step 4.3: Update App Structure

**Action**: Create locale-based app structure
**Files to create**: `src/app/[locale]/layout.tsx`
**Files to modify**: Move existing pages to locale structure

**Instructions**:
1. Create the locale-based layout
2. Move existing pages to `src/app/[locale]/` directory
3. Update the root layout to redirect to default locale

**Code to implement**:

`src/app/[locale]/layout.tsx`:
```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { AuthProvider } from '@/contexts/AuthContext';
import { ConditionalNavbar } from '@/components/ConditionalNavbar';
import { Footer } from '@/components/Footer';

const locales = ['en', 'ar'];

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ConditionalNavbar />
            {children}
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

**Verification**: Locale-based structure created and pages moved

---

### Step 4.4: Create Language Switcher Component

**Action**: Create language switcher component
**Files to create**: `src/components/LanguageSwitcher.tsx`

**Instructions**:
1. Create language switcher component
2. Include visual indicators for current language
3. Add smooth transitions and proper styling

**Code to implement**:
```typescript
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
      >
        <span>{currentLanguage?.flag}</span>
        <span className="text-sm font-medium">{currentLanguage?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLanguage(language.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                locale === language.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="font-medium">{language.name}</span>
              {locale === language.code && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

**Verification**: Language switcher component created with proper functionality

---

### Step 4.5: Update API Client

**Action**: Update API client to support language parameter
**Files to modify**: `src/lib/api.ts`

**Instructions**:
1. Read the current API client file
2. Add language parameter support to all API calls
3. Add translation trigger methods

**Code changes to implement**:
```typescript
// Add language parameter to API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private baseURL: string;
  private locale: string = 'en';

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  setLocale(locale: string) {
    this.locale = locale;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const searchParams = new URLSearchParams();
    
    // Add language parameter
    searchParams.set('lang', this.locale);
    
    const fullUrl = `${url}${url.includes('?') ? '&' : '?'}${searchParams.toString()}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Update existing methods to include language support
  async getBlogArticles(page = 1, limit = 10) {
    return this.request(`/blog/articles?page=${page}&limit=${limit}`);
  }

  async getBlogArticle(slug: string) {
    return this.request(`/blog/articles/${slug}`);
  }

  async getProjects() {
    return this.request('/projects');
  }

  async getProject(id: string) {
    return this.request(`/projects/${id}`);
  }

  async getTestimonials() {
    return this.request('/testimonials');
  }

  async getJobs() {
    return this.request('/jobs');
  }

  // Add translation trigger methods
  async triggerTranslation(type: 'blog' | 'project' | 'testimonial', id: string) {
    return this.request(`/${type}s/${id}/translate`, { method: 'POST' });
  }
}

export const apiClient = new ApiClient();
```

**Verification**: API client supports language parameter and translation triggers

---

### Step 4.6: Update Hooks to Support Language

**Action**: Update hooks to support language switching
**Files to modify**: All hook files in `src/hooks/`

**Instructions**:
1. Update each hook to use the locale from next-intl
2. Set locale in API client when hook is used
3. Ensure hooks re-fetch data when language changes

**Code changes to implement**:

For `src/hooks/useBlog.ts`:
```typescript
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { apiClient } from '@/lib/api';

export function useBlog() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const locale = useLocale();

  useEffect(() => {
    // Set locale in API client
    apiClient.setLocale(locale);
    
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getBlogArticles();
        if (response.success) {
          setArticles(response.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [locale]);

  return { articles, loading, error };
}
```

Apply similar changes to all other hooks.

**Verification**: All hooks support language switching

---

### Step 4.7: Update Components for RTL Support

**Action**: Add RTL support to CSS and components
**Files to modify**: `src/app/globals.css`

**Instructions**:
1. Read the current globals.css file
2. Add RTL support styles
3. Add Arabic font support

**Code to add**:
```css
/* RTL Support */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .flex {
  flex-direction: row-reverse;
}

[dir="rtl"] .ml-auto {
  margin-left: 0;
  margin-right: auto;
}

[dir="rtl"] .mr-auto {
  margin-right: 0;
  margin-left: auto;
}

[dir="rtl"] .text-left {
  text-align: right;
}

[dir="rtl"] .text-right {
  text-align: left;
}

[dir="rtl"] .pl-4 {
  padding-left: 0;
  padding-right: 1rem;
}

[dir="rtl"] .pr-4 {
  padding-right: 0;
  padding-left: 1rem;
}

[dir="rtl"] .ml-2 {
  margin-left: 0;
  margin-right: 0.5rem;
}

[dir="rtl"] .mr-2 {
  margin-right: 0;
  margin-left: 0.5rem;
}

/* Language-specific font adjustments */
[lang="ar"] {
  font-family: 'Hacen Algeria', 'Arial', sans-serif;
}

[lang="ar"] h1,
[lang="ar"] h2,
[lang="ar"] h3,
[lang="ar"] h4,
[lang="ar"] h5,
[lang="ar"] h6 {
  font-family: 'Hacen Algeria Bd', 'Arial', sans-serif;
  font-weight: bold;
}
```

**Verification**: RTL styles added and Arabic font support included

---

## Phase 5: Admin Panel Translation Management

### Step 5.1: Add Translation Status Indicators

**Action**: Add translation status to admin components
**Files to create**: `src/components/admin/TranslationStatus.tsx`
**Files to modify**: Admin components to show translation status

**Instructions**:
1. Create translation status component
2. Update admin components to show translation status
3. Add retranslation functionality

**Code to implement**:

`src/components/admin/TranslationStatus.tsx`:
```typescript
interface TranslationStatusProps {
  status: 'pending' | 'completed' | 'needs_review';
  lastTranslated?: Date;
  onRetranslate?: () => void;
}

export function TranslationStatus({ status, lastTranslated, onRetranslate }: TranslationStatusProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'needs_review': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Translated';
      case 'pending': return 'Pending';
      case 'needs_review': return 'Needs Review';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
        {getStatusText(status)}
      </span>
      {lastTranslated && (
        <span className="text-xs text-gray-500">
          {new Date(lastTranslated).toLocaleDateString()}
        </span>
      )}
      {status !== 'completed' && onRetranslate && (
        <button
          onClick={onRetranslate}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Retranslate
        </button>
      )}
    </div>
  );
}
```

**Verification**: Translation status component created and integrated

---

## Phase 6: Testing and Quality Assurance

### Step 6.1: Test Translation Quality

**Action**: Test the translation system
**Instructions**:
1. Create test content in English
2. Verify auto-translation works
3. Check translation quality
4. Test manual retranslation
5. Verify RTL layout works correctly

**Test cases**:
- Create a new blog article and verify Arabic translation
- Create a new project and verify Arabic translation
- Create a new testimonial and verify Arabic translation
- Switch languages and verify content changes
- Test RTL layout in Arabic

**Verification**: All translation features work correctly

---

### Step 6.2: Performance Testing

**Action**: Test performance of translation system
**Instructions**:
1. Test translation API response times
2. Verify caching works properly
3. Test with large content blocks
4. Monitor API usage and costs

**Verification**: Performance is acceptable and costs are reasonable

---

### Step 6.3: User Experience Testing

**Action**: Test user experience
**Instructions**:
1. Test language switching
2. Verify all pages work in both languages
3. Test mobile responsiveness in RTL
4. Check form submissions work correctly

**Verification**: User experience is smooth in both languages

---

## Phase 7: Deployment and Monitoring

### Step 7.1: Environment Setup

**Action**: Set up production environment
**Instructions**:
1. Set up translation API keys in production
2. Configure environment variables
3. Set up monitoring for translation API usage
4. Configure error handling and fallbacks

**Verification**: Production environment configured correctly

---

### Step 7.2: Content Migration

**Action**: Migrate existing content
**Instructions**:
1. Run translation on existing content
2. Review and approve translations
3. Update any manual translations needed
4. Test all functionality

**Verification**: All existing content is translated

---

### Step 7.3: Monitoring and Maintenance

**Action**: Set up monitoring
**Instructions**:
1. Set up alerts for translation failures
2. Monitor API usage and costs
3. Regular quality checks on translations
4. Update translation models as needed

**Verification**: Monitoring system is in place

---

## Implementation Timeline

- **Week 1**: Phase 1-2 (Setup and Database)
- **Week 2**: Phase 3 (Backend API Updates)
- **Week 3**: Phase 4 (Frontend Implementation)
- **Week 4**: Phase 5-6 (Admin Panel and Testing)
- **Week 5**: Phase 7 (Deployment and Polish)

## Cost Considerations

**100% FREE OPTIONS:**

1. **LibreTranslate (Self-hosted)**: Completely free, unlimited usage
2. **MyMemory API**: 1000 requests/day free
3. **Yandex Translate**: 10M characters/month free
4. **NextIntl**: Free for static content

**Recommended Setup:**
- LibreTranslate for unlimited free translation
- NextIntl for static UI text
- **Total cost: $0/month**

**Alternative (if you want cloud-based):**
- Yandex Translate: 10M characters/month free
- MyMemory API: 1000 requests/day free
- **Total cost: $0/month (within limits)**

## Notes

- All admin, login, and employee pages remain English-only
- Manual translation required for dynamic content (blog, projects, testimonials)
- Translation management available in admin panel
- RTL support for Arabic content
- Fallback to English if Arabic translation not available
- Translation status tracking for content management

## Success Criteria

- [ ] Arabic language support working on all public pages
- [ ] Manual translation system working for dynamic content
- [ ] RTL layout working correctly
- [ ] Language switcher functioning
- [ ] Admin panel shows translation status
- [ ] Performance is acceptable
- [ ] Static content translated via NextIntl
- [ ] No errors in console
- [ ] Mobile responsiveness maintained