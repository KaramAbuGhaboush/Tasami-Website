'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'

export default function TestAPI() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing API connection...');
        const response = await apiClient.getBlogArticles();
        console.log('API Response:', response);
        setData(response);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6812F7] mx-auto mb-4"></div>
          <p className="text-gray-600">Testing API connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API Connection Failed</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#9253F0] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Results</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          ✅ API connection successful!
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Response Data:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>

        <div className="mt-6">
          <a 
            href="/blog" 
            className="bg-[#6812F7] text-white px-6 py-3 rounded-lg hover:bg-[#9253F0] transition-colors"
          >
            Go to Blog Page
          </a>
        </div>
      </div>
    </div>
  );
}