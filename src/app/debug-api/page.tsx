'use client';

import { useEffect, useState } from 'react';

export default function DebugApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        console.log('Testing API connection...');
        
        // Test basic endpoint first
        console.log('Testing basic endpoint...');
        const basicResponse = await fetch('http://localhost:3002/api/test');
        console.log('Basic response status:', basicResponse.status);
        
        if (basicResponse.ok) {
          const basicData = await basicResponse.json();
          console.log('Basic API Response:', basicData);
        }
        
        // Test blog articles endpoint
        console.log('Testing blog articles endpoint...');
        const response = await fetch('http://localhost:3002/api/blog/articles');
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', errorText);
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        setResult(data);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
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

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">API Debug Results</h1>
      
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Error:</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h2 className="font-bold">Success!</h2>
          <p>API connection is working.</p>
        </div>
      )}
      
      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-bold mb-2">API Response:</h3>
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="font-bold mb-2">Test API Client:</h3>
        <button 
          onClick={async () => {
            try {
              const { apiClient } = await import('@/lib/api');
              const response = await apiClient.getBlogArticles();
              console.log('API Client Response:', response);
              setResult(response);
            } catch (err: any) {
              console.error('API Client Error:', err);
              setError(err.message);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test API Client
        </button>
      </div>
    </div>
  );
}
