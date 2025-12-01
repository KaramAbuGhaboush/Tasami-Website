import { ServiceInfo } from '@/hooks/useHome'

export function getHomeServices(locale: string): ServiceInfo[] {
  const services: ServiceInfo[] = [
    {
      id: "ai-solutions",
      title: "AI Solutions",
      titleAr: "حلول الذكاء الاصطناعي",
      description: "AI is a powerful business tool that enables companies to work faster, more accurately, and more profitably. From analyzing big data in seconds, to automating repetitive tasks, to understanding customers and making better decisions.",
      descriptionAr: "الذكاء الاصطناعي هو أداة أعمال قوية تمكّن الشركات من العمل بشكل أسرع، أدق، وأربح. من تحليل البيانات الضخمة خلال ثوانٍ، إلى تشغيل مهام متكررة بشكل آلي، إلى فهم العملاء واتخاذ قرارات أفضل.",
      features: [
        "AI solutions for data analysis and behavior prediction",
        "Interactive systems that understand language and communicate with customers automatically",
        "Smart automation that runs routine tasks without human intervention"
      ],
      featuresAr: [
        "حلول ذكاء اصطناعي لتحليل البيانات والتنبؤ بالسلوك",
        "أنظمة تفاعلية تفهم اللغة وتتواصل مع العملاء تلقائيًا",
        "أتمتة ذكية تشغّل المهام الروتينية بدون تدخل بشري"
      ],
      icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
      color: "#6812F7",
      animationPath: "/lotties/artificial_intelligence.json",
      order: "right"
    },
    {
      id: "automation",
      title: "Automation",
      titleAr: "الأتمتة",
      description: "Streamline workflows and eliminate manual tasks with intelligent automation solutions tailored to your specific business needs and processes.",
      descriptionAr: "تبسيط سير العمل وإزالة المهام اليدوية باستخدام حلول الأتمتة الذكية المصممة خصيصًا لاحتياجات عملك وعملياته.",
      features: [
        "Workflow Automation",
        "Process Optimization",
        "Smart Integrations"
      ],
      featuresAr: [
        "أتمتة سير العمل",
        "تحسين العمليات",
        "التكامل الذكي"
      ],
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.94 2.4a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.4 2.94a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.94-2.4a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.4-2.94.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
      color: "#9253F0",
      animationPath: "/lotties/Automation_Process.json",
      order: "left"
    },
    {
      id: "design-ux",
      title: "Design & UX/UI",
      titleAr: "التصميم وتجربة المستخدم",
      description: "Beautiful, intuitive interfaces that engage users and drive conversions through exceptional design and user experience optimization.",
      descriptionAr: "واجهات جميلة وبديهية تجذب المستخدمين وتدفع إلى التحويل من خلال التصميم الاستثنائي وتحسين تجربة المستخدم.",
      features: [
        "User Interface Design",
        "User Experience Research",
        "Prototyping & Testing"
      ],
      featuresAr: [
        "تصميم واجهة المستخدم",
        "بحث تجربة المستخدم",
        "النمذجة والاختبار"
      ],
      icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z",
      color: "#DFC7FE",
      animationPath: "/lotties/Design_X_UI.json",
      order: "right"
    },
    {
      id: "marketing",
      title: "Marketing Solutions",
      titleAr: "حلول التسويق",
      description: "Data-driven marketing strategies and campaigns that reach the right audience and deliver measurable results for your business growth.",
      descriptionAr: "استراتيجيات وحملات تسويقية مدعومة بالبيانات تصل إلى الجمهور المناسب وتوفر نتائج قابلة للقياس لنمو عملك.",
      features: [
        "Digital Marketing",
        "Content Strategy",
        "Analytics & Reporting"
      ],
      featuresAr: [
        "التسويق الرقمي",
        "استراتيجية المحتوى",
        "التحليلات والتقارير"
      ],
      icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
      color: "#6812F7",
      animationPath: "/lotties/Marketing_Solutions.json",
      order: "left"
    },
    {
      id: "mvp",
      title: "MVP Development",
      titleAr: "تطوير النسخة التجريبية الأولية",
      description: "Rapid development of minimum viable products to validate your business ideas quickly and cost-effectively with market-ready solutions.",
      descriptionAr: "تطوير سريع لنسخة أولية قابلة للتسويق للتحقق من أفكار عملك بسرعة وتكلفة منخفضة عبر حلول جاهزة للسوق.",
      features: [
        "Rapid Prototyping",
        "Market Validation",
        "Iterative Development"
      ],
      featuresAr: [
        "النمذجة السريعة",
        "التحقق من السوق",
        "التطوير التكراري"
      ],
      icon: "M13 10V3L4 14h7v7l9-11h-7z",
      color: "#9253F0",
      animationPath: "/lotties/Mvp.json",
      order: "right"
    },
    {
      id: "data-analysis",
      title: "Data Analysis",
      titleAr: "تحليل البيانات",
      description: "Transform raw data into actionable insights with advanced analytics, machine learning, and business intelligence solutions.",
      descriptionAr: "تحويل البيانات الأولية إلى رؤى قابلة للتنفيذ باستخدام التحليلات المتقدمة وتعلم الآلة وحلول ذكاء الأعمال.",
      features: [
        "Business Intelligence",
        "Predictive Analytics",
        "Data Visualization"
      ],
      featuresAr: [
        "ذكاء الأعمال",
        "التحليلات التنبؤية",
        "تصور البيانات"
      ],
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
      color: "#DFC7FE",
      animationPath: "/lotties/Data_Analysis.json",
      order: "left"
    }
  ]

  // Return services with locale-specific text
  const localizedServices = services.map(service => {
    const isArabic = locale === 'ar'
    return {
      ...service,
      title: isArabic ? (service.titleAr || service.title) : service.title,
      description: isArabic ? (service.descriptionAr || service.description) : service.description,
      features: isArabic ? (service.featuresAr || service.features) : service.features
    }
  })

  return localizedServices
}

