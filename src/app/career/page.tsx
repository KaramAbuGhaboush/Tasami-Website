import Link from 'next/link'

export default function Career() {
  const jobOpenings = [
    {
      title: "Senior AI Engineer",
      department: "AI & Technology",
      location: "Remote / San Francisco",
      type: "Full-time",
      experience: "5+ years",
      description: "Lead the development of cutting-edge AI solutions and machine learning models for our clients.",
      requirements: [
        "Master's degree in Computer Science, AI, or related field",
        "5+ years experience in machine learning and AI development",
        "Proficiency in Python, TensorFlow, PyTorch",
        "Experience with cloud platforms (AWS, GCP, Azure)",
        "Strong problem-solving and communication skills"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Learning budget", "Stock options"]
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      experience: "3+ years",
      description: "Create exceptional user experiences and beautiful interfaces for web and mobile applications.",
      requirements: [
        "Bachelor's degree in Design or related field",
        "3+ years experience in UX/UI design",
        "Proficiency in Figma, Sketch, Adobe Creative Suite",
        "Portfolio demonstrating strong design skills",
        "Experience with design systems and prototyping"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Design tools budget", "Flexible hours"]
    },
    {
      title: "Automation Specialist",
      department: "Automation",
      location: "Remote / Austin",
      type: "Full-time",
      experience: "4+ years",
      description: "Design and implement automation solutions to streamline business processes and workflows.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "4+ years experience in automation and workflow design",
        "Proficiency in Python, JavaScript, and automation tools",
        "Experience with RPA platforms (UiPath, Automation Anywhere)",
        "Strong analytical and problem-solving skills"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Professional development", "401k matching"]
    },
    {
      title: "Marketing Manager",
      department: "Marketing",
      location: "Remote / Chicago",
      type: "Full-time",
      experience: "4+ years",
      description: "Develop and execute marketing strategies to drive growth and brand awareness.",
      requirements: [
        "Bachelor's degree in Marketing or related field",
        "4+ years experience in digital marketing",
        "Proficiency in marketing automation tools",
        "Experience with SEO, SEM, and social media marketing",
        "Strong analytical and communication skills"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Marketing budget", "Performance bonuses"]
    },
    {
      title: "Full Stack Developer",
      department: "Development",
      location: "Remote / Seattle",
      type: "Full-time",
      experience: "3+ years",
      description: "Build scalable web applications using modern technologies and best practices.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "3+ years experience in full-stack development",
        "Proficiency in React, Node.js, and databases",
        "Experience with cloud platforms and DevOps",
        "Strong problem-solving and teamwork skills"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Learning budget", "Flexible schedule"]
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote / Denver",
      type: "Full-time",
      experience: "4+ years",
      description: "Manage and optimize our cloud infrastructure and deployment pipelines.",
      requirements: [
        "Bachelor's degree in Computer Science or related field",
        "4+ years experience in DevOps and cloud infrastructure",
        "Proficiency in AWS, Docker, Kubernetes",
        "Experience with CI/CD pipelines and monitoring",
        "Strong troubleshooting and automation skills"
      ],
      benefits: ["Competitive salary", "Health insurance", "Remote work", "Certification budget", "Stock options"]
    }
  ]


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4FF] via-white to-[#E8E0FF]"></div>
          
          {/* Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-30 grid-pattern"
            style={{
              backgroundImage: `
                linear-gradient(rgba(104, 18, 247, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(104, 18, 247, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>
          
          {/* Floating Elements */}
          <div className="hidden sm:block absolute top-20 left-20 w-2 h-2 bg-[#6812F7]/20 rounded-full float-gentle"></div>
          <div className="hidden sm:block absolute top-40 right-32 w-1 h-1 bg-[#9253F0]/30 rounded-full float-gentle" style={{ animationDelay: '1s' }}></div>
          <div className="hidden sm:block absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#DFC7FE]/25 rounded-full float-gentle" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-[#6812F7]/10 rounded-full text-[#6812F7] text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-[#6812F7] rounded-full mr-2"></span>
              Join 50+ Talented Professionals
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 leading-[0.9] mb-8">
              Build the Future
              <span className="block gradient-text mt-2">
                With Us
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-12">
              Join a team of innovators, creators, and problem-solvers who are transforming industries 
              through cutting-edge technology and exceptional talent.
            </p>
            
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2">50+</div>
                <div className="text-gray-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2">15+</div>
                <div className="text-gray-600">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#6812F7] mb-2">95%</div>
                <div className="text-gray-600">Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#9253F0] mb-2">4.8/5</div>
                <div className="text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Company Culture */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Culture
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                At TechFlow, we believe in creating an environment where everyone can thrive. Our culture is built on collaboration, innovation, and mutual respect.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Collaborative Environment</h3>
                    <p className="text-gray-600">We work together as a team, sharing knowledge and supporting each other's growth.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Innovation Focus</h3>
                    <p className="text-gray-600">We encourage creative thinking and experimentation to drive innovation.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Work-Life Balance</h3>
                    <p className="text-gray-600">We believe in maintaining a healthy balance between work and personal life.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="text-6xl mb-6">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Team</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-gray-600">Team Members</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">15+</div>
                    <div className="text-gray-600">Countries</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-gray-600">Retention Rate</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600">4.8/5</div>
                    <div className="text-gray-600">Team Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Open Positions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our current job openings and find the perfect role for your career growth.
            </p>
          </div>

          <div className="space-y-8">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {job.type}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {job.experience}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0">
                    <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                      {job.department}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{job.description}</p>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Requirements:</h4>
                    <ul className="space-y-2">
                      {job.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Benefits:</h4>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-start text-sm text-gray-600">
                          <svg className="w-4 h-4 text-blue-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300">
                    Apply Now
                  </button>
                  <button className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-full font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Don't See Your Role?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're always looking for talented individuals. Send us your resume and let us know how you can contribute to our team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              Send Resume
            </button>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
