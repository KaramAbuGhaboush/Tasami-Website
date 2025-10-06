'use client'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

// Project data - in a real app, this would come from a database or API
const projects = {
  'ai-ecommerce': {
    id: 'ai-ecommerce',
    title: "AI-Powered E-commerce Platform",
    category: "AI Solutions",
    headerImage: "/api/placeholder/1200/600",
    description: "Built a comprehensive e-commerce solution with AI-driven product recommendations, automated inventory management, and intelligent customer service chatbots.",
    challenge: "Our client needed a modern e-commerce platform that could handle high traffic while providing personalized shopping experiences. They were struggling with manual inventory management and customer service bottlenecks.",
    solution: "We developed a full-stack e-commerce platform powered by machine learning algorithms for product recommendations, automated inventory tracking, and AI chatbots for customer support.",
    technologies: [
      { name: "Machine Learning", description: "Custom recommendation engine using collaborative filtering" },
      { name: "React", description: "Modern frontend with responsive design" },
      { name: "Node.js", description: "Scalable backend API architecture" },
      { name: "MongoDB", description: "Flexible database for product and user data" },
      { name: "TensorFlow", description: "AI models for product recommendations" },
      { name: "AWS", description: "Cloud infrastructure for scalability" }
    ],
    results: [
      { metric: "40%", description: "Increase in sales conversion rate" },
      { metric: "60%", description: "Reduction in customer support tickets" },
      { metric: "95%", description: "Customer satisfaction score" },
      { metric: "3x", description: "Faster inventory processing" }
    ],
    timeline: "6 months",
    teamSize: "8 developers",
    clientTestimonial: {
      quote: "The AI-powered platform transformed our business completely. Sales increased by 40% within the first quarter, and our customers love the personalized experience.",
      author: "Sarah Johnson",
      position: "CEO, ShopTech Solutions"
    }
  },
  'healthcare-automation': {
    id: 'healthcare-automation',
    title: "Healthcare Automation System",
    category: "Automation",
    headerImage: "/api/placeholder/1200/600",
    description: "Developed an automated patient management system with AI-powered diagnosis assistance and automated appointment scheduling.",
    challenge: "The healthcare facility was overwhelmed with manual patient processing, appointment scheduling conflicts, and needed assistance with preliminary diagnosis to improve efficiency.",
    solution: "We created a comprehensive automation system that streamlines patient intake, uses AI for diagnosis assistance, and automatically manages appointments and resources.",
    technologies: [
      { name: "Python", description: "Backend automation scripts and AI models" },
      { name: "TensorFlow", description: "Medical diagnosis assistance AI" },
      { name: "PostgreSQL", description: "Secure patient data management" },
      { name: "Docker", description: "Containerized deployment for scalability" },
      { name: "React", description: "Healthcare professional dashboard" },
      { name: "HIPAA Compliance", description: "Secure patient data handling" }
    ],
    results: [
      { metric: "50%", description: "Faster patient processing time" },
      { metric: "30%", description: "Reduction in administrative errors" },
      { metric: "24/7", description: "System availability" },
      { metric: "85%", description: "Staff efficiency improvement" }
    ],
    timeline: "8 months",
    teamSize: "6 developers",
    clientTestimonial: {
      quote: "This system revolutionized our patient care process. We can now focus more on patients rather than paperwork, and the AI assistance has been incredibly accurate.",
      author: "Dr. Michael Chen",
      position: "Chief Medical Officer, HealthCare Plus"
    }
  },
  'fintech-mobile': {
    id: 'fintech-mobile',
    title: "FinTech Mobile App",
    category: "Design & UX/UI",
    headerImage: "/api/placeholder/1200/600",
    description: "Created a modern mobile banking application with intuitive UX/UI design, real-time transaction monitoring, and AI-powered fraud detection.",
    challenge: "The financial institution needed a mobile app that could compete with modern fintech solutions while maintaining bank-level security and compliance standards.",
    solution: "We designed and developed a user-friendly mobile banking app with advanced security features, real-time notifications, and AI-powered fraud detection.",
    technologies: [
      { name: "React Native", description: "Cross-platform mobile development" },
      { name: "TypeScript", description: "Type-safe development environment" },
      { name: "Firebase", description: "Real-time database and authentication" },
      { name: "Machine Learning", description: "Fraud detection algorithms" },
      { name: "Biometric Auth", description: "Fingerprint and face recognition" },
      { name: "Bank APIs", description: "Secure integration with banking systems" }
    ],
    results: [
      { metric: "4.8/5", description: "App store rating from users" },
      { metric: "2M+", description: "Downloads in first year" },
      { metric: "99.9%", description: "App uptime reliability" },
      { metric: "0.01%", description: "Fraud detection false positive rate" }
    ],
    timeline: "10 months",
    teamSize: "12 developers",
    clientTestimonial: {
      quote: "The app exceeded our expectations. Our customers love the intuitive design, and the fraud detection has saved us millions in potential losses.",
      author: "Jennifer Martinez",
      position: "Head of Digital Banking, SecureBank"
    }
  },
  'marketing-analytics': {
    id: 'marketing-analytics',
    title: "Marketing Analytics Dashboard",
    category: "Marketing Solutions",
    headerImage: "/api/placeholder/1200/600",
    description: "Built a comprehensive marketing analytics platform with real-time data visualization, automated reporting, and predictive insights.",
    challenge: "The marketing team was struggling with fragmented data sources, manual reporting processes, and lack of predictive insights for campaign optimization.",
    solution: "We developed a unified analytics dashboard that aggregates data from multiple sources, provides real-time visualizations, and uses AI for predictive marketing insights.",
    technologies: [
      { name: "Vue.js", description: "Interactive dashboard frontend" },
      { name: "Python", description: "Data processing and analytics backend" },
      { name: "BigQuery", description: "Large-scale data warehousing" },
      { name: "D3.js", description: "Custom data visualizations" },
      { name: "Machine Learning", description: "Predictive analytics models" },
      { name: "API Integrations", description: "Connect with marketing platforms" }
    ],
    results: [
      { metric: "300%", description: "Improvement in campaign ROI" },
      { metric: "Real-time", description: "Data insights and reporting" },
      { metric: "80%", description: "Time saved on manual reporting" },
      { metric: "95%", description: "Prediction accuracy for campaigns" }
    ],
    timeline: "5 months",
    teamSize: "7 developers",
    clientTestimonial: {
      quote: "This dashboard transformed how we approach marketing. The predictive insights helped us optimize campaigns and achieve 300% better ROI.",
      author: "Alex Thompson",
      position: "Marketing Director, GrowthCorp"
    }
  },
  'smart-manufacturing': {
    id: 'smart-manufacturing',
    title: "Smart Manufacturing System",
    category: "Automation",
    headerImage: "/api/placeholder/1200/600",
    description: "Implemented IoT-based automation for manufacturing processes with predictive maintenance and quality control systems.",
    challenge: "The manufacturing facility faced frequent equipment downtime, quality control issues, and inefficient production processes that needed modernization.",
    solution: "We implemented a comprehensive IoT system with sensors, predictive maintenance algorithms, and automated quality control to optimize the entire manufacturing process.",
    technologies: [
      { name: "IoT Sensors", description: "Real-time equipment monitoring" },
      { name: "Machine Learning", description: "Predictive maintenance models" },
      { name: "Python", description: "Data processing and automation" },
      { name: "Cloud Computing", description: "Scalable data processing infrastructure" },
      { name: "Edge Computing", description: "Real-time processing at factory floor" },
      { name: "Industrial APIs", description: "Integration with existing machinery" }
    ],
    results: [
      { metric: "25%", description: "Increase in production efficiency" },
      { metric: "40%", description: "Reduction in equipment downtime" },
      { metric: "90%", description: "Predictive maintenance accuracy" },
      { metric: "50%", description: "Reduction in quality defects" }
    ],
    timeline: "12 months",
    teamSize: "10 developers",
    clientTestimonial: {
      quote: "The smart manufacturing system revolutionized our operations. We've seen significant improvements in efficiency and dramatic reduction in unexpected downtime.",
      author: "Robert Kim",
      position: "Operations Manager, TechManufacturing Inc."
    }
  },
  'edtech-platform': {
    id: 'edtech-platform',
    title: "EdTech Learning Platform",
    category: "AI Solutions",
    headerImage: "/api/placeholder/1200/600",
    description: "Developed an AI-powered educational platform with personalized learning paths, automated assessments, and interactive content delivery.",
    challenge: "Educational institutions needed a platform that could provide personalized learning experiences at scale while reducing the administrative burden on teachers.",
    solution: "We created an AI-powered learning platform that adapts to each student's learning style, automates assessments, and provides teachers with detailed analytics.",
    technologies: [
      { name: "React", description: "Interactive learning interface" },
      { name: "Node.js", description: "Scalable backend architecture" },
      { name: "TensorFlow", description: "AI for personalized learning paths" },
      { name: "MongoDB", description: "Flexible content and user data storage" },
      { name: "WebRTC", description: "Real-time video conferencing" },
      { name: "LTI Integration", description: "Learning Management System compatibility" }
    ],
    results: [
      { metric: "85%", description: "Student engagement improvement" },
      { metric: "60%", description: "Time saved on grading" },
      { metric: "40%", description: "Improvement in learning outcomes" },
      { metric: "95%", description: "Teacher satisfaction rate" }
    ],
    timeline: "9 months",
    teamSize: "9 developers",
    clientTestimonial: {
      quote: "This platform transformed our teaching approach. Students are more engaged, and the personalized learning paths have significantly improved outcomes.",
      author: "Dr. Lisa Wang",
      position: "Dean of Education, Future University"
    }
  }
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const project = projects[id as keyof typeof projects]

  if (!project) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20">
      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/5 via-transparent to-[#9253F0]/5"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#6812F7]/10 to-[#9253F0]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-[#DFC7FE]/20 to-transparent rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#6812F7]/10 to-[#9253F0]/10 border border-[#6812F7]/20 mb-8">
              <span className="text-[#6812F7] text-sm font-semibold uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-[#6812F7] via-[#9253F0] to-[#6812F7] bg-clip-text text-transparent text-center mb-8 leading-tight">
              {project.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {project.description}
            </p>
          </div>
          
          {/* Project Meta Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="luxury-card rounded-2xl p-6 text-center hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Timeline</div>
              <div className="text-xl font-bold text-gray-900">{project.timeline}</div>
            </div>
            
            <div className="luxury-card rounded-2xl p-6 text-center hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-[#9253F0] to-[#DFC7FE] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Team Size</div>
              <div className="text-xl font-bold text-gray-900">{project.teamSize}</div>
            </div>
            
            <div className="luxury-card rounded-2xl p-6 text-center hover-lift">
              <div className="w-12 h-12 bg-gradient-to-br from-[#DFC7FE] to-[#6812F7] rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">Category</div>
              <div className="text-xl font-bold text-gray-900">{project.category}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Hero Visual */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Main Visual Container */}
            <div className="bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#DFC7FE] rounded-3xl p-8 md:p-16 shadow-2xl hover-lift">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[500px] relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/15 rounded-full blur-lg float-animation"></div>
                
                <div className="text-white text-center relative z-10">
                  <div className="w-32 h-32 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center hover-lift">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Project Showcase</h3>
                  <p className="text-lg opacity-90">Interactive project demonstration</p>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#DFC7FE] to-[#9253F0] rounded-2xl rotate-12 float-animation"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#DFC7FE] rounded-xl -rotate-12 float-animation" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section className="py-20 bg-gradient-to-br from-white via-[#F2F3FF]/30 to-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-6">
              About the Project
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#6812F7] to-[#9253F0] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="luxury-card rounded-3xl p-8 hover-lift">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-lg mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Project Overview
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">{project.description}</p>
              </div>
              
              <div className="luxury-card rounded-3xl p-8 hover-lift">
                <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#9253F0] to-[#DFC7FE] rounded-lg mr-3 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  Our Solution
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">{project.solution}</p>
              </div>
            </div>
            
            {/* Visual Element */}
            <div className="relative">
              <div className="bg-gradient-to-br from-[#6812F7]/10 to-[#9253F0]/10 rounded-3xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-3xl mx-auto mb-6 flex items-center justify-center float-animation">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Innovation in Action</h4>
                  <p className="text-gray-600">Cutting-edge technology meets creative solutions</p>
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[#DFC7FE] to-[#9253F0] rounded-2xl rotate-45 float-animation"></div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#DFC7FE] rounded-2xl -rotate-12 float-animation" style={{animationDelay: '2s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Visual Showcase */}
      <section className="py-20 bg-gradient-to-br from-[#F2F3FF]/50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-4">
              Project Showcase
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Explore the visual journey of our project development</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="group relative">
                <div className="luxury-card rounded-3xl p-4 sm:p-6 hover-lift min-h-[280px] sm:min-h-[300px] flex flex-col items-center justify-center">
                  <div className="w-16 h-24 sm:w-20 sm:h-32 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-2xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"></div>
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Mobile View {item}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 text-center">Responsive design showcase</p>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/20 to-[#9253F0]/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 text-center">
                    <svg className="w-8 h-8 text-[#6812F7] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-900">View Details</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Problems Section */}
      <section className="py-20 bg-gradient-to-br from-[#F2F3FF]/30 to-white relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-6">
              The Challenge
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#6812F7] to-[#9253F0] mx-auto rounded-full"></div>
          </div>
          
          <div className="luxury-card rounded-3xl p-8 md:p-12 hover-lift">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Problem Statement</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{project.challenge}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Solutions Section */}
      <section className="py-20 bg-gradient-to-br from-white to-[#F2F3FF]/20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-6">
              Our Solution
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#6812F7] to-[#9253F0] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="luxury-card rounded-3xl p-8 hover-lift">
              <div className="flex items-start space-x-6 mb-8">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{project.solution}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Technologies</h3>
              {project.technologies.slice(0, 4).map((tech, index) => (
                <div key={index} className="luxury-card rounded-2xl p-6 hover-lift">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-3 h-3 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 mb-2">{tech.name}</h4>
                      <p className="text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Large Visual Showcase */}
      <section className="py-20 bg-gradient-to-br from-[#F2F3FF]/50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-4">
              Desktop Application
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Full-featured desktop experience with advanced functionality</p>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#DFC7FE] rounded-3xl p-8 md:p-16 shadow-2xl hover-lift">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 flex items-center justify-center min-h-[600px] relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-8 right-8 w-40 h-40 bg-white/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/15 rounded-full blur-xl float-animation"></div>
                
                <div className="text-white text-center relative z-10">
                  <div className="w-48 h-32 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center hover-lift">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Desktop Interface</h3>
                  <p className="text-lg opacity-90">Comprehensive desktop application with advanced features</p>
                </div>
              </div>
            </div>
            
            {/* Floating decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#DFC7FE] to-[#9253F0] rounded-3xl rotate-12 float-animation"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-[#6812F7] to-[#DFC7FE] rounded-2xl -rotate-12 float-animation" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
      </section>

      {/* Enhanced User Persona / Feature Highlight */}
      <section className="py-20 bg-gradient-to-br from-[#F2F3FF]/30 to-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-4">
              User Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Designed with the end user in mind</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#DFC7FE] rounded-3xl p-8 md:p-12 hover-lift min-h-[500px] flex items-center justify-center">
                <div className="text-center text-white relative z-10">
                  <div className="w-40 h-40 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center float-animation">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">User Persona</h3>
                  <p className="text-lg opacity-90">Understanding our target audience</p>
                </div>
                
                {/* Animated background elements */}
                <div className="absolute top-6 right-6 w-24 h-24 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-20 h-20 bg-white/15 rounded-full blur-lg float-animation"></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-8">Key Features</h3>
              {[
                { title: "Intuitive Interface", description: "User-friendly design that requires no training" },
                { title: "Advanced Analytics", description: "Real-time insights and comprehensive reporting" },
                { title: "Seamless Integration", description: "Works with existing systems and workflows" }
              ].map((feature, index) => (
                <div key={index} className="luxury-card rounded-2xl p-6 hover-lift">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Style Guide Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12">
            Style Guide
          </h2>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Typography */}
            <div className="bg-emerald-50 rounded-3xl p-12">
              <div className="text-sm text-gray-500 mb-8">Typography</div>
              <div className="space-y-6">
                <div className="text-6xl font-bold text-gray-900">Inter</div>
                <p className="text-gray-600">Primary font family used throughout the application for clean, modern aesthetic.</p>
              </div>
            </div>

            {/* Typography Scale */}
            <div className="bg-gray-50 rounded-3xl p-12">
              <div className="text-sm text-gray-500 mb-8">Type Scale</div>
              <div className="space-y-4">
                <div className="text-6xl font-bold text-gray-900">Aa</div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded w-full"></div>
                  <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/5"></div>
                </div>
              </div>
            </div>

            {/* Color Palette */}
            <div className="bg-gray-900 rounded-3xl p-12 text-white">
              <div className="text-sm text-gray-400 mb-8">Primary Colors</div>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Background</div>
                  <div className="text-2xl font-mono">#1a1a1a</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Text</div>
                  <div className="text-2xl font-mono">#ffffff</div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-400 rounded-3xl p-12 text-white">
              <div className="text-sm text-emerald-900 mb-8">Accent Colors</div>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-emerald-900 mb-2">Primary</div>
                  <div className="text-2xl font-mono">#10b981</div>
                </div>
                <div>
                  <div className="text-sm text-emerald-900 mb-2">Secondary</div>
                  <div className="text-2xl font-mono">#34d399</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animations / Interactions */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Animations
          </h2>
          <p className="text-gray-600 text-lg">Smooth transitions and micro-interactions enhance the user experience.</p>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-600 rounded-3xl p-8 md:p-16">
            <div className="bg-white rounded-2xl p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                <p className="text-gray-400">Interactive Animation Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Multiple Screen Showcases */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop View */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl">
              <div className="bg-white rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-48 h-32 bg-gray-100 rounded-lg mx-auto mb-4"></div>
                  <p>Dashboard View</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="relative">
                <div className="bg-emerald-100 rounded-3xl p-6 aspect-[9/16]">
                  <div className="bg-white rounded-2xl h-full flex items-center justify-center">
                    <div className="text-center text-gray-300">
                      <div className="w-12 h-16 bg-gray-100 rounded mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-32 h-40 bg-white/20 rounded-2xl mx-auto mb-4"></div>
                  <p className="text-lg">Tablet View</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="w-40 h-28 bg-gray-100 rounded-xl mx-auto mb-4"></div>
                  <p>Desktop View</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Results Stats */}
      <section className="py-20 bg-gradient-to-br from-[#F2F3FF]/50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-6">
              Project Results
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#6812F7] to-[#9253F0] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {project.results.map((result, index) => (
              <div key={index} className="luxury-card rounded-3xl p-6 sm:p-8 text-center hover-lift">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-3 sm:mb-4">
                  {result.metric}
                </div>
                <p className="text-base sm:text-lg text-gray-600 font-medium">{result.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact CTA Section */}
      <section className="py-32 bg-gradient-to-br from-[#6812F7] via-[#9253F0] to-[#DFC7FE] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/90 via-[#9253F0]/90 to-[#DFC7FE]/90"></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto">
              Let's transform your ideas into reality with cutting-edge technology and innovative solutions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Your Project
              </button>
              <button className="btn-secondary text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-[#6812F7]">
                View Our Portfolio
              </button>
            </div>
          </div>

          {/* Client Testimonial */}
          <div className="luxury-card rounded-3xl p-8 md:p-12 bg-white/10 backdrop-blur-sm border border-white/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <blockquote className="text-xl md:text-2xl text-white mb-8 italic leading-relaxed">
                "{project.clientTestimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {project.clientTestimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="text-lg font-semibold text-white">{project.clientTestimonial.author}</div>
                  <div className="text-white/80">{project.clientTestimonial.position}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}