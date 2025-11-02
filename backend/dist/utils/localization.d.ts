type Locale = 'en' | 'ar';
interface BlogArticleRaw {
    title: string;
    titleAr?: string | null;
    excerpt?: string | null;
    excerptAr?: string | null;
    content?: string | null;
    contentAr?: string | null;
    [key: string]: any;
}
interface BlogCategoryRaw {
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    seoTitle?: string | null;
    seoTitleAr?: string | null;
    seoDescription?: string | null;
    seoDescriptionAr?: string | null;
    [key: string]: any;
}
export declare function transformArticleByLocale(article: BlogArticleRaw, locale?: Locale): any;
export declare function transformCategoryByLocale(category: BlogCategoryRaw, locale?: Locale): any;
export declare function transformArticlesByLocale(articles: BlogArticleRaw[], locale?: Locale): any[];
export declare function transformCategoriesByLocale(categories: BlogCategoryRaw[], locale?: Locale): any[];
export declare function normalizeLocale(locale?: string | null): Locale;
export {};
//# sourceMappingURL=localization.d.ts.map