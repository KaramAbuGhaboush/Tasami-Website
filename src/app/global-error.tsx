'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F2F3FF] via-white to-[#DFC7FE]/20">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
            <p className="text-gray-600 mb-6">An error occurred while loading the page.</p>
            <button
              onClick={reset}
              className="bg-gradient-to-r from-[#6812F7] to-[#9253F0] text-white px-6 py-2 rounded-lg hover:from-[#5a0fd4] hover:to-[#7d42e6] transition-all duration-200"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
