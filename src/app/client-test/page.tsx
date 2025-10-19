'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function ClientTestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApiClient = async () => {
      try {
        console.log('Testing API client...');
        
        // Test blog articles
        const response = await apiClient.getBlogArticles();
        console.log('API client response:', response);
        setResult(response);
      } catch (err: any) {
        console.error('API client error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApiClient();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>API Client Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
