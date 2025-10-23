#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Running Portfolio Admin Tests...\n');

try {
  // Run the tests
  const testCommand = 'npm test -- --testPathPattern="portfolio" --verbose --coverage';
  
  console.log('Running tests with command:', testCommand);
  console.log('='.repeat(50));
  
  execSync(testCommand, { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ All tests passed successfully!');
  
} catch (error) {
  console.error('\n❌ Tests failed:', error.message);
  process.exit(1);
}
