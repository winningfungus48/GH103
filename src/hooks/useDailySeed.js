import { useMemo } from 'react';

/**
 * useDailySeed - Returns a deterministic seed for daily games based on date and optional slug.
 * @param {Object} options
 * @param {string|Date} [options.date] - Date string (YYYY-MM-DD) or Date object. Defaults to today.
 * @param {string} [options.slug] - Optional game slug to namespace the seed.
 * @returns {string} Deterministic seed string
 */
export default function useDailySeed({ date, slug } = {}) {
  return useMemo(() => {
    let d;
    if (!date) {
      d = new Date();
    } else if (typeof date === 'string') {
      d = new Date(date);
    } else {
      d = date;
    }
    // Format as YYYY-MM-DD
    const ymd = d.toISOString().slice(0, 10);
    // Combine with slug if provided
    const base = slug ? `${slug}:${ymd}` : ymd;
    // Simple hash function for deterministic seed
    let hash = 0;
    for (let i = 0; i < base.length; i++) {
      hash = ((hash << 5) - hash) + base.charCodeAt(i);
      hash |= 0; // Convert to 32bit int
    }
    // Return as string for flexibility
    return `${Math.abs(hash)}`;
  }, [date, slug]);
}

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