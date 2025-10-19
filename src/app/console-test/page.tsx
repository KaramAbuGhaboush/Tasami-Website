'use client';

export default function ConsoleTestPage() {
  console.log('ConsoleTestPage component is rendering');
  
  return (
    <div>
      <h1>Console Test</h1>
      <p>Check the browser console for logs</p>
      <button onClick={() => console.log('Button clicked!')}>
        Click me
      </button>
    </div>
  );
}
