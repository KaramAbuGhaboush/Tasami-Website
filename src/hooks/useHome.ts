export interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  animationPath: string;
  order: 'left' | 'right';
}

export interface UseHomeReturn {
  services: ServiceInfo[];
}

export function useHome(): UseHomeReturn {
  const services: ServiceInfo[] = [
    {
      id: "ai-solutions",
      title: "AI Solutions",
      description: "Machine learning, natural language processing, and intelligent automation to revolutionize your business processes and drive unprecedented efficiency.",
      features: [
        "Machine Learning Models",
        "Natural Language Processing", 
        "Intelligent Automation"
      ],
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "#6812F7",
      animationPath: "/lotties/artificial_intelligence.json",
      order: "right"
    },
    {
      id: "automation",
      title: "Automation",
      description: "Streamline workflows and eliminate manual tasks with intelligent automation solutions tailored to your specific business needs and processes.",
      features: [
        "Workflow Automation",
        "Process Optimization",
        "Smart Integrations"
      ],
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.94 2.4a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.4 2.94a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.94-2.4a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.4-2.94.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      color: "#9253F0",
      animationPath: "/lotties/Automation_Process.json",
      order: "left"
    },
    {
      id: "design-ux",
      title: "Design & UX/UI",
      description: "Beautiful, intuitive interfaces that engage users and drive conversions through exceptional design and user experience optimization.",
      features: [
        "User Interface Design",
        "User Experience Research",
        "Prototyping & Testing"
      ],
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z",
      color: "#DFC7FE",
      animationPath: "/lotties/Design_X_UI.json",
      order: "right"
    },
    {
      id: "marketing",
      title: "Marketing Solutions",
      description: "Data-driven marketing strategies and campaigns that reach the right audience and deliver measurable results for your business growth.",
      features: [
        "Digital Marketing",
        "Content Strategy",
        "Analytics & Reporting"
      ],
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: "#6812F7",
      animationPath: "/lotties/Marketing_Solutions.json",
      order: "left"
    },
    {
      id: "mvp",
      title: "MVP Development",
      description: "Rapid development of minimum viable products to validate your business ideas quickly and cost-effectively with market-ready solutions.",
      features: [
        "Rapid Prototyping",
        "Market Validation",
        "Iterative Development"
      ],
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#9253F0",
      animationPath: "/lotties/Mvp.json",
      order: "right"
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      description: "Transform raw data into actionable insights with advanced analytics, machine learning, and business intelligence solutions.",
      features: [
        "Business Intelligence",
        "Predictive Analytics",
        "Data Visualization"
      ],
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "#DFC7FE",
      animationPath: "/lotties/Data_Analysis.json",
      order: "left"
    }
  ]

  return {
    services
  }
}
