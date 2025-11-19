"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformArticleByLocale = transformArticleByLocale;
exports.transformCategoryByLocale = transformCategoryByLocale;
exports.transformArticlesByLocale = transformArticlesByLocale;
exports.transformAuthorByLocale = transformAuthorByLocale;
exports.transformCategoriesByLocale = transformCategoriesByLocale;
exports.normalizeLocale = normalizeLocale;
exports.transformProjectByLocale = transformProjectByLocale;
exports.transformProjectCategoryByLocale = transformProjectCategoryByLocale;
exports.transformProjectTechnologyByLocale = transformProjectTechnologyByLocale;
exports.transformProjectResultByLocale = transformProjectResultByLocale;
exports.transformProjectTestimonialByLocale = transformProjectTestimonialByLocale;
exports.transformContentBlockByLocale = transformContentBlockByLocale;
exports.transformProjectsByLocale = transformProjectsByLocale;
exports.transformProjectCategoriesByLocale = transformProjectCategoriesByLocale;
exports.transformJobByLocale = transformJobByLocale;
exports.transformJobsByLocale = transformJobsByLocale;
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
function transformAuthorByLocale(author, locale = 'en') {
    if (!author)
        return author;
    const isArabic = locale === 'ar';
    return {
        ...author,
        name: isArabic && author.nameAr ? author.nameAr : author.name,
        role: isArabic && author.roleAr ? author.roleAr : author.role,
        bio: isArabic && author.bioAr ? author.bioAr : (author.bio || null),
    };
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
function transformProjectByLocale(project, locale = 'en') {
    if (!project)
        return project;
    const isArabic = locale === 'ar';
    return {
        ...project,
        title: isArabic && project.titleAr ? project.titleAr : project.title,
        description: isArabic && project.descriptionAr ? project.descriptionAr : project.description,
        challenge: isArabic && project.challengeAr ? project.challengeAr : (project.challenge || null),
        solution: isArabic && project.solutionAr ? project.solutionAr : (project.solution || null),
    };
}
function transformProjectCategoryByLocale(category, locale = 'en') {
    if (!category)
        return category;
    const isArabic = locale === 'ar';
    return {
        ...category,
        name: isArabic && category.nameAr ? category.nameAr : category.name,
        description: isArabic && category.descriptionAr ? category.descriptionAr : (category.description || null),
    };
}
function transformProjectTechnologyByLocale(technology, locale = 'en') {
    if (!technology)
        return technology;
    const isArabic = locale === 'ar';
    return {
        ...technology,
        name: isArabic && technology.nameAr ? technology.nameAr : technology.name,
        description: isArabic && technology.descriptionAr ? technology.descriptionAr : technology.description,
    };
}
function transformProjectResultByLocale(result, locale = 'en') {
    if (!result)
        return result;
    const isArabic = locale === 'ar';
    return {
        ...result,
        metric: isArabic && result.metricAr ? result.metricAr : result.metric,
        description: isArabic && result.descriptionAr ? result.descriptionAr : result.description,
    };
}
function transformProjectTestimonialByLocale(testimonial, locale = 'en') {
    if (!testimonial)
        return testimonial;
    const isArabic = locale === 'ar';
    return {
        ...testimonial,
        quote: isArabic && testimonial.quoteAr ? testimonial.quoteAr : testimonial.quote,
        author: isArabic && testimonial.authorAr ? testimonial.authorAr : testimonial.author,
        position: isArabic && testimonial.positionAr ? testimonial.positionAr : testimonial.position,
    };
}
function transformContentBlockByLocale(block, locale = 'en') {
    if (!block)
        return block;
    const isArabic = locale === 'ar';
    let transformedImages = block.images;
    if (block.images && Array.isArray(block.images)) {
        transformedImages = block.images.map((image) => ({
            ...image,
            alt: isArabic && image.altAr ? image.altAr : (image.alt || null),
            caption: isArabic && image.captionAr ? image.captionAr : (image.caption || null),
        }));
    }
    return {
        ...block,
        content: isArabic && block.contentAr ? block.contentAr : (block.content || null),
        alt: isArabic && block.altAr ? block.altAr : (block.alt || null),
        caption: isArabic && block.captionAr ? block.captionAr : (block.caption || null),
        images: transformedImages,
    };
}
function transformProjectsByLocale(projects, locale = 'en') {
    if (!Array.isArray(projects))
        return projects;
    return projects.map(project => transformProjectByLocale(project, locale));
}
function transformProjectCategoriesByLocale(categories, locale = 'en') {
    if (!Array.isArray(categories))
        return categories;
    return categories.map(category => transformProjectCategoryByLocale(category, locale));
}
function transformJobByLocale(job, locale = 'en') {
    if (!job)
        return job;
    const isArabic = locale === 'ar';
    let transformedRequirements = job.requirements;
    if (job.requirements && Array.isArray(job.requirements)) {
        if (isArabic && job.requirementsAr && Array.isArray(job.requirementsAr)) {
            transformedRequirements = job.requirementsAr;
        }
        else {
            transformedRequirements = job.requirements;
        }
    }
    let transformedBenefits = job.benefits;
    if (job.benefits && Array.isArray(job.benefits)) {
        if (isArabic && job.benefitsAr && Array.isArray(job.benefitsAr)) {
            transformedBenefits = job.benefitsAr;
        }
        else {
            transformedBenefits = job.benefits;
        }
    }
    return {
        ...job,
        title: isArabic && job.titleAr ? job.titleAr : job.title,
        department: isArabic && job.departmentAr ? job.departmentAr : job.department,
        location: isArabic && job.locationAr ? job.locationAr : job.location,
        type: isArabic && job.typeAr ? job.typeAr : job.type,
        experience: isArabic && job.experienceAr ? job.experienceAr : job.experience,
        description: isArabic && job.descriptionAr ? job.descriptionAr : job.description,
        requirements: transformedRequirements,
        benefits: transformedBenefits,
        salary: isArabic && job.salaryAr ? job.salaryAr : (job.salary || null),
        team: isArabic && job.teamAr ? job.teamAr : (job.team || null),
    };
}
function transformJobsByLocale(jobs, locale = 'en') {
    if (!Array.isArray(jobs))
        return jobs;
    return jobs.map(job => transformJobByLocale(job, locale));
}
//# sourceMappingURL=localization.js.map