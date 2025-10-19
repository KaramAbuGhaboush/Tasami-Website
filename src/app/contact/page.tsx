'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    service: '',
    budget: '',
    message: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const contactInfo = [
    {
      title: "Email Us",
      description: "Get a personalized response within 2 hours",
      contact: "hello@tasami.com",
      icon: "📧",
      urgency: "Fast Response"
    },
    {
      title: "WhatsApp",
      description: "Chat with us instantly",
      contact: "+1 (555) 123-4567",
      icon: "💬",
      urgency: "Instant Chat"
    },
    {
      title: "Schedule 30 mins meeting with our CEO",
      description: "Direct access to our CEO for strategic discussions",
      contact: "Book Meeting",
      icon: "👔",
      urgency: "CEO Access"
    }
  ]

  const projectTypes = [
    "Web Development",
    "Mobile App Development",
    "AI & Machine Learning",
    "Business Process Automation",
    "UX/UI Design",
    "Digital Marketing",
    "Data Analytics",
    "Cloud Solutions",
    "Other"
  ]

  const budgetRanges = [
    "Under $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000+",
    "Not sure yet"
  ]

  const timelines = [
    "ASAP (Rush project)",
    "Within 1 month",
    "1-3 months",
    "3-6 months",
    "6+ months",
    "Flexible"
  ]




  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-200">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">You're One Step Closer to Success!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for reaching out! Our team is reviewing your project details and will contact you within <strong>24 hours</strong> with a personalized proposal.
            </p>
            <div className="bg-green-50 p-4 rounded-xl mb-6">
              <p className="text-green-800 font-semibold">
                🚀 Next Steps: We'll send you a detailed project roadmap and timeline within 48 hours!
              </p>
            </div>
            <button
              onClick={() => {
                setIsSubmitted(false)
                setFormData({
                  name: '',
                  company: '',
                  email: '',
                  service: '',
                  budget: '',
                  message: ''
                })
              }}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Start Another Project
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/30 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full text-blue-600 text-sm font-medium mb-8 border border-blue-200">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-3 animate-pulse"></span>
              Ready to Transform Your Business?
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Build Something
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                Extraordinary Together
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              We're a <strong>new, innovative company</strong> ready to help you transform your business with cutting-edge AI, automation, and design solutions. 
              <span className="text-blue-600 font-semibold"> Let's build something amazing together!</span>
            </p>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 mb-12">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>24-Hour Response Time</span>
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Free Consultation</span>
          </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>Satisfaction Guarantee</span>
        </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <span>No Long-term Contracts</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Form */}
      <section className="py-20 bg-gradient-to-br from-[#F8F4FF] to-[#E8E0FF] relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(104, 18, 247, 0.1) 50%, transparent 60%),
                linear-gradient(-45deg, transparent 40%, rgba(146, 83, 240, 0.1) 50%, transparent 60%)
              `,
              backgroundSize: '100px 100px'
            }}
          ></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Get in Touch - Left Side */}
            <div className="space-y-6 lg:space-y-8">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                  Let's start the <span className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent">dialogue</span> now!
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 mb-6 lg:mb-8">
                  Are you ready to elevate your brand's digital presence? We lead an exceptional team of developers, designers, and AI specialists ready to transform your vision into reality.
                </p>
              </div>
              
              <div className="space-y-6 lg:space-y-8">
                <div className="text-center lg:text-left">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 lg:mb-4">Prefer a different approach?</h4>
                  <p className="text-gray-600 mb-4 lg:mb-6 text-sm sm:text-base">We're flexible and here to help in whatever way works best for you.</p>
                </div>
                
                <div className="space-y-3 lg:space-y-4">
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">📧</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">Email us directly</div>
                        <div className="text-gray-600 text-xs sm:text-sm truncate">hello@tasami.com</div>
                      </div>
                    </div>
                    <a href="mailto:hello@tasami.com" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      Send →
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">💬</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">WhatsApp chat</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Quick questions</div>
                      </div>
                    </div>
                    <a href="https://wa.me/1234567890" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      Chat →
                    </a>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-gradient-to-r hover:from-[#6812F7]/10 hover:to-[#9253F0]/10 hover:border-[#6812F7]/20 transition-all duration-300">
                    <div className="flex items-center min-w-0 flex-1">
                      <div className="text-xl sm:text-2xl mr-2 sm:mr-3 flex-shrink-0">👔</div>
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">30-min CEO meeting</div>
                        <div className="text-gray-600 text-xs sm:text-sm">Strategic discussions</div>
                      </div>
                    </div>
                    <a href="#" className="text-[#6812F7] hover:text-[#9253F0] font-medium transition-colors text-sm sm:text-base flex-shrink-0 ml-2">
                      Book →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form - Right Side */}
            <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-fit">
              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#6812F7]/10 to-[#9253F0]/10 rounded-full text-[#6812F7] text-sm font-medium mb-4">
                    <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2 animate-pulse"></span>
                    Ready to Get Started?
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Build Something Amazing</h2>
                  <p className="text-gray-600 text-lg">Tell us about your project and we'll get back to you within 24 hours</p>
                </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Jane Cooper"
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                      placeholder="Ex. Tesla Inc"
                    />
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500"
                    placeholder="You@Example.Com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="group">
                    <label htmlFor="service" className="block text-sm font-bold text-gray-900 mb-2">
                      Service Required *
                    </label>
                    <div className="relative">
                      <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 appearance-none bg-transparent text-gray-900 pr-8"
                      >
                        <option value="">Select Your Service</option>
                        {projectTypes.map((type, index) => (
                          <option key={index} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="budget" className="block text-sm font-bold text-gray-900 mb-2">
                      Project Budget *
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        required
                        className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 appearance-none bg-transparent text-gray-900 pr-8"
                      >
                        <option value="">Select Your Range</option>
                        {budgetRanges.map((budget, index) => (
                          <option key={index} value={budget}>{budget}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
                    Project Details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full py-3 px-0 border-0 border-b-2 border-gray-300 focus:border-[#6812F7] focus:outline-none transition-all duration-300 bg-transparent text-gray-900 placeholder-gray-500 resize-none"
                    placeholder="Tell us more about your idea"
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      "Send inquiry"
                    )}
                  </button>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 flex items-center justify-center">
                    <span className="mr-2">🔒</span>
                    Your information is secure and will never be shared
                  </p>
                </div>
              </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
