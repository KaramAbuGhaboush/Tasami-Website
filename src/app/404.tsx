'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#6812F7]/5 via-transparent to-[#9253F0]/5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-[#6812F7]/10 to-[#9253F0]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-tr from-[#DFC7FE]/20 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 text-center">
        {/* 404 Icon */}
        <div className="w-32 h-32 bg-gradient-to-br from-[#6812F7] to-[#9253F0] rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-[#6812F7] to-[#9253F0] bg-clip-text text-transparent mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.back()}
            className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-8 py-3 rounded-xl font-semibold hover:from-[#5a0fd4] hover:to-[#7d42e6] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Go Back
          </button>
          <Link
            href="/"
            className="border-2 border-[#6812F7] text-[#6812F7] px-8 py-3 rounded-xl font-semibold hover:bg-[#6812F7] hover:text-white transition-all duration-200 transform hover:scale-105"
          >
            Go Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-sm text-gray-500">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}
