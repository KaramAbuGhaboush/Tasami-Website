import { useState } from 'react'

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface UseAboutReturn {
  values: Value[];
  faqs: FAQ[];
  openFAQ: number | null;
  setOpenFAQ: (index: number | null) => void;
}

export function useAbout(): UseAboutReturn {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

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
      question: "How long has your company been in business?",
      answer: "We're a fresh, dynamic startup founded in 2024. While we're new to the market, our team brings decades of combined experience from top tech companies and successful startups."
    },
    {
      question: "What makes you different from established agencies?",
      answer: "As a new company, we offer fresh perspectives, cutting-edge approaches, and personalized attention that larger agencies can't match. We're agile, innovative, and deeply invested in each client's success."
    },
    {
      question: "Do you have experience with our industry?",
      answer: "Our team has worked across various industries including healthcare, finance, e-commerce, and SaaS. We bring diverse experience and adapt quickly to new sectors and challenges."
    },
    {
      question: "What's your team structure?",
      answer: "We're a lean, focused team with senior leadership across all key areas. This structure allows us to be nimble, cost-effective, and provide direct access to decision-makers."
    },
    {
      question: "How do you ensure quality with a small team?",
      answer: "Our small team is our strength. Each member is a senior expert in their field, ensuring high-quality work. We also partner with trusted specialists when needed, maintaining our core team's focus and expertise."
    },
    {
      question: "What's your pricing structure?",
      answer: "We offer competitive, transparent pricing tailored to each project. As a new company, we provide excellent value while maintaining high standards. We're happy to discuss custom packages that fit your budget."
    },
    {
      question: "How do you handle project management?",
      answer: "We use modern project management tools and maintain regular communication with clients. Our small team ensures direct access to decision-makers and faster response times than larger agencies."
    },
    {
      question: "What if we need to scale our project?",
      answer: "We're designed to grow with you. Our flexible team structure allows us to bring in specialized talent as needed, ensuring we can handle projects of any size while maintaining our personal touch."
    }
  ]

  return {
    values,
    faqs,
    openFAQ,
    setOpenFAQ
  }
}
