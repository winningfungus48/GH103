import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Hook that returns a deterministic seed based on date
 * @param {Date} date - Optional date to use (defaults to current date)
 * @returns {string} Deterministic seed string
 */
export const useDailySeed = (date = new Date()) => {
  const [searchParams] = useSearchParams();
  const testDate = searchParams.get('testDate');

  return useMemo(() => {
    // Use testDate if provided, otherwise use the passed date or current date
    const targetDate = testDate ? new Date(testDate) : date;
    
    // Format as YYYY-MM-DD for consistent seeding
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    
    // Return deterministic seed string
    return `${year}-${month}-${day}`;
  }, [date, testDate]);
};

/**
 * Utility function to convert a seed string to a numeric seed
 * @param {string} seedString - The seed string from useDailySeed
 * @returns {number} Numeric seed for random number generation
 */
export const stringToSeed = (seedString) => {
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

export default useDailySeed; 