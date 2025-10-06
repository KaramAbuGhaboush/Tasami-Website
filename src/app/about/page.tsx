import Link from 'next/link'

export default function About() {

  const values = [
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">TechFlow</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a team of passionate technologists dedicated to transforming businesses through innovative AI, automation, design, and marketing solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2019, TechFlow began as a small team of passionate technologists who believed in the transformative power of AI and automation. What started as a vision to help businesses streamline their operations has grown into a comprehensive technology company.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Today, we've successfully delivered over 500 projects for clients ranging from startups to Fortune 500 companies. Our expertise spans across AI solutions, automation, design, UX/UI, and marketing, making us a one-stop partner for digital transformation.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to staying at the forefront of technology, continuously learning and adapting to bring our clients the most innovative and effective solutions.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white p-6 rounded-xl">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-gray-600">Projects Delivered</div>
                </div>
                <div className="bg-white p-6 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <div className="text-gray-600">Client Satisfaction</div>
                </div>
                <div className="bg-white p-6 rounded-xl">
                  <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                  <div className="text-gray-600">Team Members</div>
                </div>
                <div className="bg-white p-6 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600 mb-2">5+</div>
                  <div className="text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation. We believe technology should be accessible, understandable, and transformative for organizations of all sizes.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading technology partner that helps businesses navigate the digital landscape, leveraging AI, automation, and design to create a more efficient and connected world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and shape our company culture
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* CTA Section */}
      <section className="py-20 gradient-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Work With Us?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Let's discuss how our team can help transform your business with innovative technology solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Get in Touch
            </Link>
            <Link
              href="/career"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#6812F7] transition-all duration-300"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
