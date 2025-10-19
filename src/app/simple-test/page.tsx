'use client';

import { useEffect, useState } from 'react';

export default function SimpleTestPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('SimpleTestPage useEffect running');
    
    const fetchData = async () => {
      try {
        console.log('Starting fetch...');
        const response = await fetch('http://localhost:3002/api/test');
        console.log('Response received:', response);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Data received:', result);
        setData(result);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to see if it's a timing issue
    setTimeout(() => {
      fetchData();
    }, 100);
  }, []);

  console.log('SimpleTestPage render - loading:', loading, 'error:', error, 'data:', data);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Simple Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
