export interface Service {
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  color: string;
  icon: string;
  features: string[];
}

export function getServicesData() {
  const services: Service[] = [
    {
      title: "AI Solutions",
      description: "Harness the power of artificial intelligence to transform your business operations and decision-making processes.",
      features: [
        "Machine Learning Models",
        "Natural Language Processing",
        "Computer Vision Solutions",
        "Predictive Analytics",
        "Chatbots & Virtual Assistants",
        "AI-Powered Automation"
      ],
      icon: "🤖",
      color: "white"
    },
    {
      title: "Automation",
      description: "Streamline your workflows and eliminate repetitive tasks with intelligent automation solutions.",
      features: [
        "Workflow Automation",
        "Process Optimization",
        "Data Integration",
        "API Development",
        "System Integration",
        "Custom Automation Tools"
      ],
      icon: "⚙️",
      color: "white"
    },
    {
      title: "Design & UX/UI",
      description: "Create exceptional user experiences with beautiful, intuitive designs that drive engagement and conversions.",
      features: [
        "User Experience Design",
        "User Interface Design",
        "Prototyping & Wireframing",
        "Design Systems",
        "Mobile App Design",
        "Web Design"
      ],
      icon: "🎨",
      color: "white"
    },
    {
      title: "Marketing Solutions",
      description: "Data-driven marketing strategies and campaigns that reach your target audience and deliver measurable results.",
      features: [
        "Digital Marketing Strategy",
        "SEO & SEM",
        "Social Media Marketing",
        "Content Marketing",
        "Email Marketing",
        "Analytics & Reporting"
      ],
      icon: "📈",
      color: "orange"
    },
    {
      title: "Quality Assurance",
      description: "Comprehensive testing and quality assurance to ensure your solutions are robust, reliable, and performant.",
      features: [
        "Automated Testing",
        "Performance Testing",
        "Security Testing",
        "User Acceptance Testing",
        "Code Review",
        "Quality Metrics"
      ],
      icon: "✅",
      color: "indigo"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support and maintenance to keep your systems running smoothly and efficiently.",
      features: [
        "Technical Support",
        "System Monitoring",
        "Performance Optimization",
        "Security Updates",
        "Backup & Recovery",
        "Incident Response"
      ],
      icon: "🛠️",
      color: "pink"
    }
  ]

  const processSteps: ProcessStep[] = [
    {
      step: "01",
      title: "Discovery & Analysis",
      description: "We dive deep into your business requirements, analyze your current systems, and understand your vision to create a tailored solution.",
      color: "from-blue-500 to-blue-600",
      icon: "🔍",
      features: ["Requirements Analysis", "Stakeholder Interviews", "Technical Assessment"]
    },
    {
      step: "02", 
      title: "Strategic Planning",
      description: "We develop a comprehensive roadmap with clear milestones, timelines, and deliverables that align with your business objectives.",
      color: "from-purple-500 to-purple-600",
      icon: "📋",
      features: ["Project Roadmap", "Resource Planning", "Risk Assessment"]
    },
    {
      step: "03",
      title: "Development & Testing", 
      description: "Our expert team builds your solution using cutting-edge technologies, following best practices and rigorous testing protocols.",
      color: "from-green-500 to-green-600",
      icon: "⚡",
      features: ["Agile Development", "Quality Assurance", "Performance Testing"]
    },
    {
      step: "04",
      title: "Deployment & Support",
      description: "We deploy your solution seamlessly and provide ongoing support, monitoring, and optimization to ensure optimal performance.",
      color: "from-orange-500 to-orange-600",
      icon: "🚀",
      features: ["Smooth Deployment", "24/7 Monitoring", "Continuous Support"]
    }
  ]

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-600",
      purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-600",
      green: "from-green-50 to-green-100 border-green-200 text-green-600",
      orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-600",
      indigo: "from-indigo-50 to-indigo-100 border-indigo-200 text-indigo-600",
      pink: "from-pink-50 to-pink-100 border-pink-200 text-pink-600",
      white: "from-white to-white border-white text-white"
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.blue
  }

  return {
    services,
    processSteps,
    getColorClasses
  }
}

