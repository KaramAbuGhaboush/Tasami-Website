"use client"
import React, { createContext, useContext, useState, useEffect } from "react";
import en from '../locales/en.json';
import ar from '../locales/ar.json';

// Define the language context
type LanguageContextType = {
    language: string;
    translations: Record<string, unknown>;
    setLanguage: (lang: string) => void;
    t: (key: string) => string;
    isInitialized: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Function to get browser language
const getBrowserLanguage = (): string => {
    if (typeof window === 'undefined') return 'en';

    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    const langCode = browserLang.split('-')[0]; // Get language code (e.g., 'ar' from 'ar-SA')

    // Check if the language is supported
    return ['ar', 'en'].includes(langCode) ? langCode : 'en';
};

// Function to get nested translation value
const getNestedTranslation = (obj: Record<string, unknown>, key: string): string => {
    const result = key.split('.').reduce((o, k) => o?.[k], obj);
    return typeof result === 'string' ? result : key;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<string>('en');
    const [translations, setTranslations] = useState<Record<string, unknown>>(en);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Get saved language or detect browser language
        const savedLanguage = localStorage.getItem('language');
        const detectedLanguage = savedLanguage || getBrowserLanguage();

        setLanguage(detectedLanguage);
        document.documentElement.lang = detectedLanguage;
        document.documentElement.dir = detectedLanguage === 'ar' ? 'rtl' : 'ltr';

        // Load the correct translation file
        if (detectedLanguage === 'ar') {
            setTranslations(ar);
        } else {
            setTranslations(en);
        }

        setIsInitialized(true);
    }, []);

    const changeLanguage = (lang: string) => {
        localStorage.setItem('language', lang);
        setLanguage(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

        if (lang === 'ar') {
            setTranslations(ar);
        } else {
            setTranslations(en);
        }
    };

    // Translation function
    const t = (key: string): string => {
        if (!isInitialized) return key;
        return getNestedTranslation(translations, key);
    };

    return (
        <LanguageContext.Provider value={{ language, translations, setLanguage: changeLanguage, t, isInitialized }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
