// Simple test for useDailySeed functionality
// This can be run manually to verify the hook works as expected

import { stringToSeed } from './useDailySeed';

// Test the stringToSeed utility function
const testStringToSeed = () => {
  console.log('Testing stringToSeed function...');
  
  const testCases = [
    '2025-01-15',
    '2025-01-16', 
    '2024-12-31',
    '2025-02-29' // Leap year
  ];
  
  testCases.forEach(dateString => {
    const seed = stringToSeed(dateString);
    console.log(`${dateString} -> ${seed}`);
  });
  
  // Verify deterministic behavior
  const sameDate = '2025-01-15';
  const seed1 = stringToSeed(sameDate);
  const seed2 = stringToSeed(sameDate);
  console.log(`Deterministic test: ${seed1 === seed2 ? 'PASS' : 'FAIL'}`);
};

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  window.testDailySeed = testStringToSeed;
  console.log('Daily seed test available at window.testDailySeed()');
} else {
  // Node environment
  testStringToSeed();
} 