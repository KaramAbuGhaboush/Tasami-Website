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
interface BlogAuthorRaw {
    name: string;
    nameAr?: string | null;
    role: string;
    roleAr?: string | null;
    bio?: string | null;
    bioAr?: string | null;
    [key: string]: any;
}
export declare function transformArticleByLocale(article: BlogArticleRaw, locale?: Locale): any;
export declare function transformCategoryByLocale(category: BlogCategoryRaw, locale?: Locale): any;
export declare function transformArticlesByLocale(articles: BlogArticleRaw[], locale?: Locale): any[];
export declare function transformAuthorByLocale(author: BlogAuthorRaw, locale?: Locale): any;
export declare function transformCategoriesByLocale(categories: BlogCategoryRaw[], locale?: Locale): any[];
export declare function normalizeLocale(locale?: string | null): Locale;
interface ProjectRaw {
    title: string;
    titleAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    challenge?: string | null;
    challengeAr?: string | null;
    solution?: string | null;
    solutionAr?: string | null;
    [key: string]: any;
}
interface ProjectCategoryRaw {
    name: string;
    nameAr?: string | null;
    description?: string | null;
    descriptionAr?: string | null;
    [key: string]: any;
}
interface ProjectTechnologyRaw {
    name: string;
    nameAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    [key: string]: any;
}
interface ProjectResultRaw {
    metric: string;
    metricAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    [key: string]: any;
}
interface ProjectTestimonialRaw {
    quote: string;
    quoteAr?: string | null;
    author: string;
    authorAr?: string | null;
    position: string;
    positionAr?: string | null;
    [key: string]: any;
}
interface ContentBlockRaw {
    content?: string | null;
    contentAr?: string | null;
    alt?: string | null;
    altAr?: string | null;
    caption?: string | null;
    captionAr?: string | null;
    [key: string]: any;
}
export declare function transformProjectByLocale(project: ProjectRaw, locale?: Locale): any;
export declare function transformProjectCategoryByLocale(category: ProjectCategoryRaw, locale?: Locale): any;
export declare function transformProjectTechnologyByLocale(technology: ProjectTechnologyRaw, locale?: Locale): any;
export declare function transformProjectResultByLocale(result: ProjectResultRaw, locale?: Locale): any;
export declare function transformProjectTestimonialByLocale(testimonial: ProjectTestimonialRaw, locale?: Locale): any;
export declare function transformContentBlockByLocale(block: ContentBlockRaw, locale?: Locale): any;
export declare function transformProjectsByLocale(projects: ProjectRaw[], locale?: Locale): any[];
export declare function transformProjectCategoriesByLocale(categories: ProjectCategoryRaw[], locale?: Locale): any[];
interface JobRaw {
    title: string;
    titleAr?: string | null;
    department: string;
    departmentAr?: string | null;
    location: string;
    locationAr?: string | null;
    type: string;
    typeAr?: string | null;
    experience: string;
    experienceAr?: string | null;
    description: string;
    descriptionAr?: string | null;
    requirements?: any;
    requirementsAr?: any;
    benefits?: any;
    benefitsAr?: any;
    salary?: string | null;
    salaryAr?: string | null;
    team?: string | null;
    teamAr?: string | null;
    [key: string]: any;
}
export declare function transformJobByLocale(job: JobRaw, locale?: Locale): any;
export declare function transformJobsByLocale(jobs: JobRaw[], locale?: Locale): any[];
export {};
//# sourceMappingURL=localization.d.ts.map