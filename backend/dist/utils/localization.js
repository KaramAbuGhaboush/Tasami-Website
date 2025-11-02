"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformArticleByLocale = transformArticleByLocale;
exports.transformCategoryByLocale = transformCategoryByLocale;
exports.transformArticlesByLocale = transformArticlesByLocale;
exports.transformCategoriesByLocale = transformCategoriesByLocale;
exports.normalizeLocale = normalizeLocale;
function transformArticleByLocale(article, locale = 'en') {
    if (!article)
        return article;
    const isArabic = locale === 'ar';
    return {
        ...article,
        title: isArabic && article.titleAr ? article.titleAr : article.title,
        excerpt: isArabic && article.excerptAr ? article.excerptAr : (article.excerpt || null),
        content: isArabic && article.contentAr ? article.contentAr : (article.content || null),
    };
}
function transformCategoryByLocale(category, locale = 'en') {
    if (!category)
        return category;
    const isArabic = locale === 'ar';
    return {
        ...category,
        name: isArabic && category.nameAr ? category.nameAr : category.name,
        description: isArabic && category.descriptionAr ? category.descriptionAr : (category.description || null),
        seoTitle: isArabic && category.seoTitleAr ? category.seoTitleAr : (category.seoTitle || null),
        seoDescription: isArabic && category.seoDescriptionAr ? category.seoDescriptionAr : (category.seoDescription || null),
    };
}
function transformArticlesByLocale(articles, locale = 'en') {
    if (!Array.isArray(articles))
        return articles;
    return articles.map(article => transformArticleByLocale(article, locale));
}
function transformCategoriesByLocale(categories, locale = 'en') {
    if (!Array.isArray(categories))
        return categories;
    return categories.map(category => transformCategoryByLocale(category, locale));
}
function normalizeLocale(locale) {
    if (locale === 'ar' || locale === 'en') {
        return locale;
    }
    return 'en';
}
//# sourceMappingURL=localization.js.map