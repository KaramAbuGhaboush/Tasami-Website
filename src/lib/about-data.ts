export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export function getAboutData() {
  const values: Value[] = [
    {
      title: "Innovation",
      description: "We constantly push the boundaries of what's possible with technology, always seeking innovative solutions to complex problems.",
      icon: "💡"
    },
    {
      title: "Quality",
      description: "We maintain the highest standards in everything we do, ensuring our solutions are robust, reliable, and performant.",
      icon: "⭐"
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and work closely with our clients to achieve shared success.",
      icon: "🤝"
    },
    {
      title: "Transparency",
      description: "We maintain open communication and provide clear insights into our processes and progress.",
      icon: "🔍"
    }
  ]

  const faqs: FAQ[] = [
    {
      question: "What solutions does Tasami provide?",
      answer: "We deliver a full stack of tech and marketing solutions, including app development, automation systems, branding, social media management, and digital performance optimization."
    },
    {
      question: "How long does a project usually take?",
      answer: "Timelines depend on the project size, but we always follow a clear roadmap and fixed milestones to ensure fast and organized delivery."
    },
    {
      question: "Can I request updates after the project is delivered?",
      answer: "Yes, we offer post-delivery support and continuous upgrade options as your business grows."
    },
    {
      question: "How do you ensure high-quality results?",
      answer: "We follow a structured workflow, run pre-delivery testing, and rely on data insights to deliver results that actually perform."
    },
    {
      question: "Do you offer ready-made pricing plans?",
      answer: "Yes, we provide flexible packages for small and medium businesses, plus custom proposals for special projects."
    }
  ]

  return {
    values,
    faqs
  }
}

