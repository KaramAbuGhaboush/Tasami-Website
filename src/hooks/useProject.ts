import { notFound } from 'next/navigation'

export interface Technology {
  name: string;
  description: string;
}

export interface Result {
  metric: string;
  description: string;
}

export interface ClientTestimonial {
  quote: string;
  author: string;
  position: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  headerImage: string;
  description: string;
  challenge: string;
  solution: string;
  technologies: Technology[];
  results: Result[];
  timeline: string;
  teamSize: string;
  clientTestimonial: ClientTestimonial;
}

// Project data - in a real app, this would come from a database or API
const projects: Record<string, Project> = {
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

export interface UseProjectReturn {
  project: Project | null;
  notFound: boolean;
}

export function useProject(projectId: string): UseProjectReturn {
  const project = projects[projectId] || null;
  
  if (!project) {
    notFound();
  }

  return {
    project,
    notFound: !project
  };
}
