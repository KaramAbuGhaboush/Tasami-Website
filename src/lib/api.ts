import { API_BASE_URL } from './config';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // Ensure baseUrl is valid
    if (!this.baseUrl || this.baseUrl === 'undefined' || this.baseUrl.includes('undefined')) {
      console.error('Invalid API base URL:', this.baseUrl);
      throw new Error('API base URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    // Get token from localStorage (only in browser)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
      // Add cache control headers to prevent stale data
      cache: 'no-store' as RequestCache,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API request failed:', { 
          status: response.status, 
          statusText: response.statusText, 
          url,
          error: errorText.substring(0, 200) 
        });
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : error instanceof TypeError
        ? error.message
        : typeof error === 'string'
        ? error
        : error?.toString() || 'Unknown error';
      
      console.error('API request error:', {
        message: errorMessage,
        url,
        baseUrl: this.baseUrl,
        endpoint,
        errorType: error?.constructor?.name || typeof error,
        error: error
      });
      throw error instanceof Error ? error : new Error(errorMessage);
    }
  }

  // Blog API
  async getBlogArticles(params?: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    locale?: 'en' | 'ar';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.category) searchParams.append('category', params.category);
    if (params?.featured !== undefined) searchParams.append('featured', params.featured.toString());
    if (params?.locale) {
      searchParams.append('locale', params.locale);
    }
    // Add cache-busting timestamp to prevent stale data
    searchParams.append('_t', Date.now().toString());
    
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

  async getBlogArticle(slug: string, locale?: 'en' | 'ar') {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    const queryString = searchParams.toString();
    const endpoint = `/blog/articles/${slug}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { article: any };
    }>(endpoint);
  }

  async getBlogAuthors() {
    return this.request<{
      success: boolean;
      data: { authors: any[] };
    }>('/blog/authors');
  }

  async uploadBlogImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.request<{ success: boolean; data: { filename: string; url: string } }>('/blog/upload-image', {
      method: 'POST',
      body: formData,
    });
  }

  async createArticle(articleData: {
    title: string;
    titleAr?: string;
    excerpt: string;
    excerptAr?: string;
    content: string;
    contentAr?: string;
    image?: string;
    readTime?: string;
    featured?: boolean;
    status?: string;
    tags?: string[];
    relatedArticles?: string[];
    authorId: string;
    categoryId: string;
    seoTitle?: string;
    seoDescription?: string;
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
    category?: string;
    locale?: 'en' | 'ar';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.locale) searchParams.append('locale', params.locale);
    
    const queryString = searchParams.toString();
    const endpoint = `/projects${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        projects: any[];
      };
    }>(endpoint);
  }

  async getProject(id: string, locale?: 'en' | 'ar') {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    
    const queryString = searchParams.toString();
    const endpoint = `/projects/${id}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { project: any };
    }>(endpoint);
  }

  // Career API
  async getJobs(params?: {
    page?: number;
    limit?: number;
    department?: string;
    location?: string;
    type?: string;
    locale?: 'en' | 'ar';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.department) searchParams.append('department', params.department);
    if (params?.location) searchParams.append('location', params.location);
    if (params?.type) searchParams.append('type', params.type);
    if (params?.locale) searchParams.append('locale', params.locale);
    
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

  async getJob(id: string, locale?: 'en' | 'ar') {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    const queryString = searchParams.toString();
    const endpoint = `/career/jobs/${id}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { job: any };
    }>(endpoint);
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
    salary?: string;
    applicationDeadline?: string;
    status?: string;
    team?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { job: any };
    }>('/career/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: string, jobData: {
    title?: string;
    department?: string;
    location?: string;
    type?: string;
    experience?: string;
    description?: string;
    requirements?: string[];
    benefits?: string[];
    salary?: string;
    applicationDeadline?: string;
    status?: string;
    team?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { job: any };
    }>(`/career/jobs/${id}`, {
      method: 'PUT',
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
    titleAr?: string;
    excerpt?: string;
    excerptAr?: string;
    content?: string;
    contentAr?: string;
    image?: string;
    readTime?: string;
    featured?: boolean;
    status?: string;
    tags?: string[];
    relatedArticles?: string[];
    authorId?: string;
    categoryId?: string;
    seoTitle?: string;
    seoDescription?: string;
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

  // Blog Category API methods
  async getBlogCategories(locale?: 'en' | 'ar') {
    const searchParams = new URLSearchParams();
    if (locale) searchParams.append('locale', locale);
    const queryString = searchParams.toString();
    const endpoint = `/blog/categories${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { categories: any[] };
    }>(endpoint);
  }

  async createBlogCategory(categoryData: {
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

  async updateBlogCategory(id: string, categoryData: {
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

  async deleteBlogCategory(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/blog/categories/${id}`, {
      method: 'DELETE',
    });
  }


  // Contact API
  async getContactMessages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    service?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.service) searchParams.append('service', params.service);
    if (params?.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = `/contact/messages${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        messages: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
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

  async testContactEmail() {
    return this.request<{
      success: boolean;
      message: string;
    }>('/contact/test-email', {
      method: 'POST',
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


  // Time Tracking API
  async getTimeEntries(params?: {
    filter?: 'today' | 'week' | 'all';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.append('filter', params.filter);
    
    const queryString = searchParams.toString();
    const endpoint = `/time-entries${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { 
        items: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async createTimeEntry(entryData: {
    date: string;
    hours: number;
    minutes: number;
    project: string;
    description?: string;
  }) {
    return this.request<{
      success: boolean;
      data: any;
      message: string;
    }>('/time-entries', {
      method: 'POST',
      body: JSON.stringify(entryData),
    });
  }

  async updateTimeEntry(id: string, entryData: {
    date?: string;
    hours?: number;
    minutes?: number;
    project?: string;
    description?: string;
  }) {
    return this.request<{
      success: boolean;
      data: { timeEntry: any };
    }>(`/time-entries/${id}`, {
      method: 'PUT',
      body: JSON.stringify(entryData),
    });
  }

  async deleteTimeEntry(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/time-entries/${id}`, {
      method: 'DELETE',
    });
  }

  async getWeeklySummary() {
    return this.request<{
      success: boolean;
      data: {
        totalHours: number;
        totalMinutes: number;
        entries: any[];
        goal: number;
        progress: number;
      };
    }>('/time-entries/weekly-summary');
  }

  // Authentication API
  async login(credentials: {
    email: string;
    password: string;
  }) {
    return this.request<{
      success: boolean;
      data: {
        token: string;
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
        };
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    name?: string;
  }) {
    return this.request<{
      success: boolean;
      data: {
        token: string;
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
        };
      };
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<{
      success: boolean;
      data: {
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
          weeklyGoal: number;
        };
      };
    }>('/auth/me');
  }

  async logout() {
    return this.request<{
      success: boolean;
      message: string;
    }>('/auth/logout', {
      method: 'POST',
    });
  }

  // User Profile API
  async getUserProfile() {
    return this.request<{
      success: boolean;
      data: {
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
          weeklyGoal: number;
          isActive: boolean;
          createdAt: string;
        };
      };
    }>('/time-entries/profile');
  }

  async updateWeeklyGoal(weeklyGoal: number) {
    return this.request<{
      success: boolean;
      data: {
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
          weeklyGoal: number;
          isActive: boolean;
          createdAt: string;
        };
      };
      message: string;
    }>('/time-entries/profile/weekly-goal', {
      method: 'PUT',
      body: JSON.stringify({ weeklyGoal }),
    });
  }

  // Employee/User Management API
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: string;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.department) searchParams.append('department', params.department);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = `/employees${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        items: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async getEmployee(id: string) {
    return this.request<{
      success: boolean;
      data: { employee: any };
    }>(`/employees/${id}`);
  }

  async createEmployee(employeeData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    department?: string;
    role: 'admin' | 'employee';
    isActive: boolean;
    weeklyGoal: number;
  }) {
    return this.request<{
      success: boolean;
      data: { employee: any };
      message: string;
    }>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: string, employeeData: {
    name?: string;
    email?: string;
    phone?: string;
    department?: string;
    role?: 'admin' | 'employee';
    isActive?: boolean;
    weeklyGoal?: number;
  }) {
    return this.request<{
      success: boolean;
      data: { employee: any };
      message: string;
    }>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  async getEmployeeTimeEntries(id: string, params?: {
    filter?: 'today' | 'week' | 'all';
  }) {
    const searchParams = new URLSearchParams();
    if (params?.filter) searchParams.append('filter', params.filter);
    
    const queryString = searchParams.toString();
    const endpoint = `/employees/${id}/time-entries${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { 
        items: any[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          pages: number;
        };
      };
    }>(endpoint);
  }

  async changeEmployeeRole(id: string, role: 'admin' | 'employee') {
    return this.request<{
      success: boolean;
      data: { employee: any };
      message: string;
    }>(`/employees/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  }

  async resetEmployeePassword(id: string, password: string) {
    return this.request<{
      success: boolean;
      message: string;
    }>(`/employees/${id}/password`, {
      method: 'PUT',
      body: JSON.stringify({ password }),
    });
  }

  async updateEmployeeGoal(id: string, weeklyGoal: number) {
    return this.request<{
      success: boolean;
      data: { employee: any };
      message: string;
    }>(`/employees/${id}/goal`, {
      method: 'PUT',
      body: JSON.stringify({ weeklyGoal }),
    });
  }

  async toggleEmployeeStatus(id: string) {
    return this.request<{
      success: boolean;
      data: { employee: any };
      message: string;
    }>(`/employees/${id}/toggle-status`, {
      method: 'PUT',
    });
  }

  async getEmployeeTimeEntries(id: string, params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    const endpoint = `/employees/${id}/time-entries${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: { timeEntries: any[] };
    }>(endpoint);
  }

  async getEmployeeWeeklySummary(id: string, params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    const endpoint = `/employees/${id}/weekly-summary${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        totalHours: number;
        totalMinutes: number;
        entries: any[];
        goal: number;
        progress: number;
      };
    }>(endpoint);
  }

  async getTeamStats() {
    return this.request<{
      success: boolean;
      data: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        adminUsers: number;
        employeeUsers: number;
        newUsersThisMonth: number;
        usersMeetingGoals: number;
      };
    }>('/employees/stats');
  }

  async getTeamAnalytics(params?: {
    startDate?: string;
    endDate?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    
    const queryString = searchParams.toString();
    const endpoint = `/employees/analytics/team-summary${queryString ? `?${queryString}` : ''}`;
    
    return this.request<{
      success: boolean;
      data: {
        totalUsers: number;
        activeUsers: number;
        totalHours: number;
        averageHoursPerUser: number;
        goalAchievementRate: number;
        usersMeetingGoals: number;
        usersExceedingGoals: number;
        usersBelowGoals: number;
        period: {
          startDate: string;
          endDate: string;
        };
      };
    }>(endpoint);
  }

  async getProjectDistribution() {
    return this.request<{
      success: boolean;
      data: {
        projects: Array<{
          name: string;
          hours: number;
          percentage: number;
          color: string;
        }>;
      };
    }>('/employees/analytics/project-distribution');
  }

  async bulkUpdateEmployees(userIds: string[], updates: {
    role?: 'admin' | 'employee';
    isActive?: boolean;
    weeklyGoal?: number;
    department?: string;
  }) {
    return this.request<{
      success: boolean;
      data: {
        updatedCount: number;
        failedUpdates: any[];
      };
      message: string;
    }>('/employees/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ userIds, updates }),
    });
  }
}

// Create and export a singleton instance
export const apiClient = new ApiClient();
export default apiClient;
