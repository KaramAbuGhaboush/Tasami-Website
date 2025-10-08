import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8F4FF] via-white to-[#E8E0FF]"></div>
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
        <div className="absolute top-20 left-20 w-2 h-2 bg-[#6812F7]/20 rounded-full float-gentle"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-[#9253F0]/30 rounded-full float-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-[#DFC7FE]/25 rounded-full float-gentle" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-20 w-1 h-1 bg-[#6812F7]/15 rounded-full float-gentle" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <div className="text-8xl sm:text-9xl font-bold text-gray-900 mb-4">
            4
            <span className="inline-block animate-bounce text-[#6812F7]">0</span>
            4
          </div>
        </div>
        
        {/* Error Message */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Oops! Page Not Found
        </h1>
        
        <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
          The page you're looking for seems to have vanished into the digital void. 
          Don't worry, even the best explorers sometimes take a wrong turn.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/contact"
            className="border-2 border-[#6812F7] text-[#6812F7] px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#6812F7] hover:text-white transition-all duration-300"
          >
            💬 Get Help
          </Link>
        </div>
        
        {/* Quick Links */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Popular Pages</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/services"
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">🚀</div>
              <div className="text-sm font-medium text-gray-900">Services</div>
            </Link>
            <Link
              href="/about"
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">👥</div>
              <div className="text-sm font-medium text-gray-900">About Us</div>
            </Link>
            <Link
              href="/work"
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">💼</div>
              <div className="text-sm font-medium text-gray-900">Our Work</div>
            </Link>
            <Link
              href="/blog"
              className="p-4 bg-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sm font-medium text-gray-900">Blog</div>
            </Link>
          </div>
        </div>
        
        {/* Fun Message */}
        <div className="mt-12 text-gray-500">
          <p className="text-sm">
            💡 <strong>Pro tip:</strong> If you keep getting lost, try using our search feature or navigation menu!
          </p>
        </div>
      </div>
    </div>
  )
}
