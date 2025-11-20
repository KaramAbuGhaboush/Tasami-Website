/**
 * Localization utility functions for transforming data based on locale
 */

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

/**
 * Transform a blog article based on locale
 * Returns the appropriate fields based on locale, falling back to English if Arabic fields don't exist
 */
export function transformArticleByLocale(article: BlogArticleRaw, locale: Locale = 'en'): any {
  if (!article) return article;

  const isArabic = locale === 'ar';

  return {
    ...article,
    title: isArabic && article.titleAr ? article.titleAr : article.title,
    excerpt: isArabic && article.excerptAr ? article.excerptAr : (article.excerpt || null),
    content: isArabic && article.contentAr ? article.contentAr : (article.content || null),
  };
}

/**
 * Transform a blog category based on locale
 */
export function transformCategoryByLocale(category: BlogCategoryRaw, locale: Locale = 'en'): any {
  if (!category) return category;

  const isArabic = locale === 'ar';

  return {
    ...category,
    name: isArabic && category.nameAr ? category.nameAr : category.name,
    description: isArabic && category.descriptionAr ? category.descriptionAr : (category.description || null),
    seoTitle: isArabic && category.seoTitleAr ? category.seoTitleAr : (category.seoTitle || null),
    seoDescription: isArabic && category.seoDescriptionAr ? category.seoDescriptionAr : (category.seoDescription || null),
  };
}

/**
 * Transform an array of blog articles based on locale
 */
export function transformArticlesByLocale(articles: BlogArticleRaw[], locale: Locale = 'en'): any[] {
  if (!Array.isArray(articles)) return articles;
  return articles.map(article => transformArticleByLocale(article, locale));
}

/**
 * Transform a blog author based on locale
 */
export function transformAuthorByLocale(author: BlogAuthorRaw, locale: Locale = 'en'): any {
  if (!author) return author;

  const isArabic = locale === 'ar';

  return {
    ...author,
    name: isArabic && author.nameAr ? author.nameAr : author.name,
    role: isArabic && author.roleAr ? author.roleAr : author.role,
    bio: isArabic && author.bioAr ? author.bioAr : (author.bio || null),
  };
}

/**
 * Transform an array of blog categories based on locale
 */
export function transformCategoriesByLocale(categories: BlogCategoryRaw[], locale: Locale = 'en'): any[] {
  if (!Array.isArray(categories)) return categories;
  return categories.map(category => transformCategoryByLocale(category, locale));
}

/**
 * Validate and normalize locale parameter
 */
export function normalizeLocale(locale?: string | null): Locale {
  if (locale === 'ar' || locale === 'en') {
    return locale;
  }
  return 'en'; // Default to English
}

// Project-related interfaces
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

/**
 * Transform a project based on locale
 */
export function transformProjectByLocale(project: ProjectRaw, locale: Locale = 'en'): any {
  if (!project) return project;

  const isArabic = locale === 'ar';

  return {
    ...project,
    title: isArabic && project.titleAr ? project.titleAr : project.title,
    description: isArabic && project.descriptionAr ? project.descriptionAr : project.description,
    challenge: isArabic && project.challengeAr ? project.challengeAr : (project.challenge || null),
    solution: isArabic && project.solutionAr ? project.solutionAr : (project.solution || null),
  };
}

/**
 * Transform a project category based on locale
 */
export function transformProjectCategoryByLocale(category: ProjectCategoryRaw, locale: Locale = 'en'): any {
  if (!category) return category;

  const isArabic = locale === 'ar';

  return {
    ...category,
    name: isArabic && category.nameAr ? category.nameAr : category.name,
    description: isArabic && category.descriptionAr ? category.descriptionAr : (category.description || null),
  };
}

/**
 * Transform a project technology based on locale
 */
export function transformProjectTechnologyByLocale(technology: ProjectTechnologyRaw, locale: Locale = 'en'): any {
  if (!technology) return technology;

  const isArabic = locale === 'ar';

  return {
    ...technology,
    name: isArabic && technology.nameAr ? technology.nameAr : technology.name,
    description: isArabic && technology.descriptionAr ? technology.descriptionAr : technology.description,
  };
}

/**
 * Transform a project result based on locale
 */
export function transformProjectResultByLocale(result: ProjectResultRaw, locale: Locale = 'en'): any {
  if (!result) return result;

  const isArabic = locale === 'ar';

  return {
    ...result,
    metric: isArabic && result.metricAr ? result.metricAr : result.metric,
    description: isArabic && result.descriptionAr ? result.descriptionAr : result.description,
  };
}

/**
 * Transform a project testimonial based on locale
 */
export function transformProjectTestimonialByLocale(testimonial: ProjectTestimonialRaw, locale: Locale = 'en'): any {
  if (!testimonial) return testimonial;

  const isArabic = locale === 'ar';

  return {
    ...testimonial,
    quote: isArabic && testimonial.quoteAr ? testimonial.quoteAr : testimonial.quote,
    author: isArabic && testimonial.authorAr ? testimonial.authorAr : testimonial.author,
    position: isArabic && testimonial.positionAr ? testimonial.positionAr : testimonial.position,
  };
}

/**
 * Transform a content block based on locale
 */
export function transformContentBlockByLocale(block: ContentBlockRaw, locale: Locale = 'en'): any {
  if (!block) return block;

  const isArabic = locale === 'ar';

  // Transform images array if it exists
  let transformedImages = block.images;
  if (block.images && Array.isArray(block.images)) {
    transformedImages = block.images.map((image: any) => ({
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

/**
 * Transform an array of projects based on locale
 */
export function transformProjectsByLocale(projects: ProjectRaw[], locale: Locale = 'en'): any[] {
  if (!Array.isArray(projects)) return projects;
  return projects.map(project => transformProjectByLocale(project, locale));
}

/**
 * Transform an array of project categories based on locale
 */
export function transformProjectCategoriesByLocale(categories: ProjectCategoryRaw[], locale: Locale = 'en'): any[] {
  if (!Array.isArray(categories)) return categories;
  return categories.map(category => transformProjectCategoryByLocale(category, locale));
}

// Career/Job-related interfaces
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

/**
 * Transform a job based on locale
 */
export function transformJobByLocale(job: JobRaw, locale: Locale = 'en'): any {
  if (!job) return job;

  const isArabic = locale === 'ar';

  // Transform requirements array
  let transformedRequirements = job.requirements;
  if (job.requirements && Array.isArray(job.requirements)) {
    if (isArabic && job.requirementsAr && Array.isArray(job.requirementsAr)) {
      transformedRequirements = job.requirementsAr;
    } else {
      transformedRequirements = job.requirements;
    }
  }

  // Transform benefits array
  let transformedBenefits = job.benefits;
  if (job.benefits && Array.isArray(job.benefits)) {
    if (isArabic && job.benefitsAr && Array.isArray(job.benefitsAr)) {
      transformedBenefits = job.benefitsAr;
    } else {
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

/**
 * Transform an array of jobs based on locale
 */
export function transformJobsByLocale(jobs: JobRaw[], locale: Locale = 'en'): any[] {
  if (!Array.isArray(jobs)) return jobs;
  return jobs.map(job => transformJobByLocale(job, locale));
}

