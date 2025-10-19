'use client';

import { useEffect, useState } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        console.log('Testing API client...');
        
        // Test direct fetch first
        console.log('Testing direct fetch...');
        const directResponse = await fetch('http://localhost:3002/api/test');
        const directData = await directResponse.json();
        console.log('Direct fetch result:', directData);
        
        // Test blog articles endpoint
        console.log('Testing blog articles endpoint...');
        const blogResponse = await fetch('http://localhost:3002/api/blog/articles');
        const blogData = await blogResponse.json();
        console.log('Blog articles result:', blogData);
        
        setResult({
          direct: directData,
          blog: blogData
        });
      } catch (err: any) {
        console.error('API test error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>API Test Results</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
