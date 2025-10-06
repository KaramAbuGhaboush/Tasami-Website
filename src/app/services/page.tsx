import Link from 'next/link'

export default function Services() {
  const services = [
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive technology solutions designed to accelerate your digital transformation and drive business growth.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="group relative h-[500px] w-full rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 500"><rect width="300" height="500" fill="%23f3f4f6"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="48">${service.icon}</text></svg>')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Default State - Background Image with Title */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-300 flex flex-col justify-start p-8">
                  <h3 className="text-4xl font-bold text-black group-hover:opacity-0 transition-opacity duration-300">
                    {service.title}
                  </h3>
                </div>
                
                {/* Hover State - Solid Color with Description and CTA */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-start p-8">
                  <h3 className="text-4xl font-bold text-white mb-6">
                    {service.title}
                  </h3>
                  <div className="flex-1 flex flex-col justify-end">
                    <p className="text-white/90 text-base mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <Link
                      href="#"
                      className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 w-fit"
                    >
                      Get Started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Process
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A proven methodology that ensures successful project delivery and client satisfaction
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Discovery</h3>
              <p className="text-gray-600">We analyze your requirements and understand your business goals to create a tailored solution.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Planning</h3>
              <p className="text-gray-600">We develop a comprehensive project plan with clear milestones and deliverables.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Development</h3>
              <p className="text-gray-600">Our expert team builds your solution using cutting-edge technologies and best practices.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Deployment</h3>
              <p className="text-gray-600">We deploy your solution and provide ongoing support to ensure optimal performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Let's discuss your project requirements and how we can help you achieve your business goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get a Quote
            </Link>
            <Link
              href="/work"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
