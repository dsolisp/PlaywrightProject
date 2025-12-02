import { logger } from './logger';

/**
 * Performance Monitor
 * Equivalent to Python's utils/performance_monitor.py
 */

interface TimingEntry {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

interface PerformanceStats {
  count: number;
  totalMs: number;
  minMs: number;
  maxMs: number;
  avgMs: number;
}

export class PerformanceMonitor {
  private name: string;
  private timings: Map<string, TimingEntry[]> = new Map();
  private activeTimers: Map<string, number> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Start timing an operation
   */
  startTimer(operationName: string): void {
    this.activeTimers.set(operationName, performance.now());
  }

  /**
   * Stop timing an operation
   */
  stopTimer(operationName: string): number {
    const startTime = this.activeTimers.get(operationName);
    if (!startTime) {
      throw new Error(`No active timer for: ${operationName}`);
    }

    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);

    // Store timing
    const entries = this.timings.get(operationName) || [];
    entries.push({ name: operationName, startTime, endTime, duration });
    this.timings.set(operationName, entries);

    // Clean up
    this.activeTimers.delete(operationName);

    logger.debug(`${this.name}: ${operationName} completed in ${duration}ms`);
    return duration;
  }

  /**
   * Time an async operation
   */
  async timeAsync<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
    this.startTimer(operationName);
    try {
      return await operation();
    } finally {
      this.stopTimer(operationName);
    }
  }

  /**
   * Time a sync operation
   */
  timeSync<T>(operationName: string, operation: () => T): T {
    this.startTimer(operationName);
    try {
      return operation();
    } finally {
      this.stopTimer(operationName);
    }
  }

  /**
   * Get statistics for an operation
   */
  getStats(operationName: string): PerformanceStats | null {
    const entries = this.timings.get(operationName);
    if (!entries || entries.length === 0) return null;

    const durations = entries.map((e) => e.duration || 0);
    const totalMs = durations.reduce((a, b) => a + b, 0);

    return {
      count: entries.length,
      totalMs,
      minMs: Math.min(...durations),
      maxMs: Math.max(...durations),
      avgMs: Math.round(totalMs / entries.length),
    };
  }

  /**
   * Get all statistics
   */
  getAllStats(): Record<string, PerformanceStats> {
    const stats: Record<string, PerformanceStats> = {};
    for (const [name] of this.timings) {
      const stat = this.getStats(name);
      if (stat) stats[name] = stat;
    }
    return stats;
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    const lines: string[] = [`Performance Report: ${this.name}`, '═'.repeat(50)];

    const stats = this.getAllStats();
    for (const [name, stat] of Object.entries(stats)) {
      lines.push(`${name}:`);
      lines.push(`  Count: ${stat.count}`);
      lines.push(`  Avg: ${stat.avgMs}ms`);
      lines.push(`  Min: ${stat.minMs}ms`);
      lines.push(`  Max: ${stat.maxMs}ms`);
    }

    return lines.join('\n');
  }

  /**
   * Clear all timings
   */
  clear(): void {
    this.timings.clear();
    this.activeTimers.clear();
  }
}

// Global performance monitor
export const globalMonitor = new PerformanceMonitor('Global');
