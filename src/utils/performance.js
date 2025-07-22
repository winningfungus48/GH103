// Performance monitoring utility for game loading times

class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.isEnabled = import.meta.env.DEV || localStorage.getItem('gh103_performance_monitoring') === 'true';
  }

  // Start timing a game load
  startGameLoad(gameSlug) {
    if (!this.isEnabled) return;
    
    this.metrics[gameSlug] = {
      startTime: performance.now(),
      gameSlug
    };
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] Starting load for ${gameSlug}`);
    }
  }

  // End timing a game load
  endGameLoad(gameSlug) {
    if (!this.isEnabled || !this.metrics[gameSlug]) return;
    
    const endTime = performance.now();
    const duration = endTime - this.metrics[gameSlug].startTime;
    
    this.metrics[gameSlug].endTime = endTime;
    this.metrics[gameSlug].duration = duration;
    
    // Store in localStorage for persistence
    const storedMetrics = JSON.parse(localStorage.getItem('gh103_game_load_times') || '{}');
    storedMetrics[gameSlug] = {
      ...this.metrics[gameSlug],
      timestamp: Date.now()
    };
    localStorage.setItem('gh103_game_load_times', JSON.stringify(storedMetrics));
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${gameSlug} loaded in ${duration.toFixed(2)}ms`);
    }
    
    // Track analytics if available
    try {
      if (window.gtag) {
        window.gtag('event', 'game_load_time', {
          game_name: gameSlug,
          load_time_ms: Math.round(duration)
        });
      }
    } catch (err) {
      // Analytics not available, ignore
    }
  }

  // Get average load time for a game
  getAverageLoadTime(gameSlug) {
    const storedMetrics = JSON.parse(localStorage.getItem('gh103_game_load_times') || '{}');
    const gameMetrics = storedMetrics[gameSlug];
    
    if (!gameMetrics) return null;
    
    return gameMetrics.duration;
  }

  // Get all stored metrics
  getAllMetrics() {
    return JSON.parse(localStorage.getItem('gh103_game_load_times') || '{}');
  }

  // Clear stored metrics
  clearMetrics() {
    localStorage.removeItem('gh103_game_load_times');
    this.metrics = {};
  }

  // Enable/disable monitoring
  setEnabled(enabled) {
    this.isEnabled = enabled;
    localStorage.setItem('gh103_performance_monitoring', enabled.toString());
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor; 