const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('API Request:', { url, baseUrl: this.baseUrl, endpoint, options });
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('Making fetch request to:', url);
      const response = await fetch(url, config);
      console.log('Fetch response:', { status: response.status, ok: response.ok, statusText: response.statusText });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK:', { status: response.status, statusText: response.statusText, body: errorText });
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('API Response data:', data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        name: error instanceof Error ? error.name : undefined
      });
      throw error;
    }
  }

  // Blog API
  async getBlogArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/blog/articles${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        articles: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getBlogArticle(slug: string) {
    return this.request<{
      success: boolean;
      data: { article: any };
    }>(`/blog/articles/${slug}`);
  }

  async getBlogCategories() {
    return this.request<{
      success: boolean;
      data: { categories: any[] };
    }>('/blog/categories');
  }

  async getBlogAuthors() {
    return this.request<{
      success: boolean;
      data: { authors: any[] };
    }>('/blog/authors');
  }

  async createArticle(articleData: {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    readTime: string;
    featured: boolean;
    status: string;
    tags: string[];
    authorId: string;
    categoryId: string;
  }) {
    return this.request<{
      success: boolean;
      data: { article: any };
    }>('/blog/articles', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  }

  // Projects API
  async getProjects(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        projects: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getProject(id: string) {
    return this.request<{
      success: boolean;
      data: { project: any };
    }>(`/projects/${id}`);
  }

  // Career API
  async getJobs(params?: {
    page?: number;
    limit?: number;
    department?: string;
    location?: string;
    type?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.department) searchParams.append('department', params.department);
    if (params?.location) searchParams.append('location', params.location);
    if (params?.type) searchParams.append('type', params.type);
    
    const queryString = searchParams.toString();
    const endpoint = `/career/jobs${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        jobs: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getJob(id: string) {
    return this.request<{
      success: boolean;
      data: { job: any };
    }>(`/career/jobs/${id}`);
  }

  async submitJobApplication(applicationData: {
    jobId: string;
    applicantName: string;
    applicantEmail: string;
    applicantPhone?: string;
    applicantLocation?: string;
    resume?: string;
    coverLetter?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
    }>('/career/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async createJob(jobData: {
    title: string;
    department: string;
    location: string;
    type: string;
    experience: string;
    description: string;
    requirements: string[];
    benefits: string[];
    skills?: string[];
    salary?: string;
    applicationDeadline?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { job: any };
    }>('/career/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/career/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async updateArticle(id: string, articleData: {
    title?: string;
    excerpt?: string;
    content?: string;
    image?: string;
    readTime?: string;
    featured?: boolean;
    status?: string;
    tags?: string[];
    authorId?: string;
    categoryId?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { article: any };
    }>(`/blog/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(articleData),
    });
  }

  async deleteArticle(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/blog/articles/${id}`, {
      method: 'DELETE',
    });
  }

  // Author API methods
  async getAuthors() {
    return this.request<{
      success: boolean;
      data: { authors: any[] };
    }>('/blog/authors');
  }

  async createAuthor(authorData: {
    name: string;
    email: string;
    role?: string;
    avatar?: string;
    bio?: string;
    socialLinks?: any;
    expertise?: string[];
  }) {
    return this.request<{
      success: boolean;
      data: { author: any };
    }>('/blog/authors', {
      method: 'POST',
      body: JSON.stringify(authorData),
    });
  }

  async updateAuthor(id: string, authorData: {
    name?: string;
    email?: string;
    role?: string;
    avatar?: string;
    bio?: string;
    socialLinks?: any;
    expertise?: string[];
  }) {
    return this.request<{
      success: boolean;
      data: { author: any };
    }>(`/blog/authors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(authorData),
    });
  }

  async deleteAuthor(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/blog/authors/${id}`, {
      method: 'DELETE',
    });
  }

  // Category API methods
  async getCategories() {
    return this.request<{
      success: boolean;
      data: { categories: any[] };
    }>('/blog/categories');
  }

  async createCategory(categoryData: {
    name: string;
    description?: string;
    color?: string;
    icon?: string;
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { category: any };
    }>('/blog/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: {
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    featured?: boolean;
    seoTitle?: string;
    seoDescription?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { category: any };
    }>(`/blog/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/blog/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact API
  async getContactMessages() {
    return this.request<{
      success: boolean;
      data: { messages: any[] };
    }>('/contact/messages');
  }

  async submitContactMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    service?: string;
    budget?: string;
  }) {
    return this.request<{
      success: boolean;
      message: string;
      data: { contactMessage: any };
    }>('/contact/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async updateContactMessage(id: string, messageData: {
    status?: string;
    priority?: string;
    assignedTo?: string;
    notes?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { message: any };
    }>(`/contact/messages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(messageData),
    });
  }

  async deleteContactMessage(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/contact/messages/${id}`, {
      method: 'DELETE',
    });
  }

  // Financial API
  async getFinancialOverview() {
    return this.request<{
      success: boolean;
      data: { overview: any };
    }>('/financial/overview');
  }

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/financial/transactions${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        transactions: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getInvoices(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/financial/invoices${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        invoices: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getClients(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/financial/clients${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        clients: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getEmployees(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.department) searchParams.append('department', params.department);
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/financial/employees${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        employees: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getSalaries(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/financial/salaries${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        salaries: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  // Testimonials API
  async getTestimonials(params?: {
    featured?: boolean;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/testimonials${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { testimonials: any[] };
    }>(endpoint);
  }

  async getTestimonial(id: string) {
    return this.request<{
      success: boolean;
      data: { testimonial: any };
    }>(`/testimonials/${id}`);
  }

  async createTestimonial(testimonialData: {
    name: string;
    role?: string;
    company?: string;
    quote: string;
    rating?: number;
    initials?: string;
    featured?: boolean;
    status?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { testimonial: any };
    }>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData),
    });
  }

  async updateTestimonial(id: string, testimonialData: {
    name?: string;
    role?: string;
    company?: string;
    quote?: string;
    rating?: number;
    initials?: string;
    featured?: boolean;
    status?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { testimonial: any };
    }>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testimonialData),
    });
  }

  async deleteTestimonial(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/testimonials/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories API
  async getCategories(params?: {
    featured?: boolean;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.status) searchParams.append('status', params.status);
    
    const queryString = searchParams.toString();
    const endpoint = `/categories${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { categories: any[] };
    }>(endpoint);
  }

  async getCategory(id: string) {
    return this.request<{
      success: boolean;
      data: { category: any };
    }>(`/categories/${id}`);
  }

  async createCategory(categoryData: {
    name: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
    featured?: boolean;
    sortOrder?: number;
    status?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { category: any };
    }>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: {
    name?: string;
    slug?: string;
    description?: string;
    color?: string;
    icon?: string;
    featured?: boolean;
    sortOrder?: number;
    status?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { category: any };
    }>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
