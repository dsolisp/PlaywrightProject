import { describe, it, expect, beforeEach } from 'vitest';
import { PerformanceMonitor } from '../../src/utils/performance-monitor';

/**
 * Performance Monitor Unit Tests
 * Equivalent to Python's tests/unit/test_performance_monitor.py
 */

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    monitor = new PerformanceMonitor('TestMonitor');
  });

  describe('Timer Operations', () => {
    it('should start and stop timer', async () => {
      monitor.startTimer('test-operation');
      await sleep(50);
      const duration = monitor.stopTimer('test-operation');

      expect(duration).toBeGreaterThanOrEqual(40);
      expect(duration).toBeLessThan(200);
    });

    it('should throw error for unknown timer', () => {
      expect(() => monitor.stopTimer('unknown')).toThrow('No active timer');
    });
  });

  describe('Async Timing', () => {
    it('should time async operations', async () => {
      const result = await monitor.timeAsync('async-op', async () => {
        await sleep(30);
        return 'done';
      });

      expect(result).toBe('done');
      const stats = monitor.getStats('async-op');
      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(1);
      expect(stats!.avgMs).toBeGreaterThanOrEqual(20);
    });
  });

  describe('Sync Timing', () => {
    it('should time sync operations', () => {
      const result = monitor.timeSync('sync-op', () => {
        let sum = 0;
        for (let i = 0; i < 10000; i++) sum += i;
        return sum;
      });

      expect(result).toBe(49995000);
      const stats = monitor.getStats('sync-op');
      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(1);
    });
  });

  describe('Statistics', () => {
    it('should calculate correct statistics', async () => {
      // Run operation multiple times
      for (let i = 0; i < 3; i++) {
        await monitor.timeAsync('repeated-op', async () => {
          await sleep(10);
        });
      }

      const stats = monitor.getStats('repeated-op');
      expect(stats).not.toBeNull();
      expect(stats!.count).toBe(3);
      expect(stats!.minMs).toBeGreaterThanOrEqual(0);
      expect(stats!.maxMs).toBeGreaterThanOrEqual(stats!.minMs);
      expect(stats!.avgMs).toBeGreaterThanOrEqual(stats!.minMs);
      expect(stats!.avgMs).toBeLessThanOrEqual(stats!.maxMs);
    });

    it('should return null for unknown operation', () => {
      expect(monitor.getStats('unknown')).toBeNull();
    });

    it('should get all stats', async () => {
      await monitor.timeAsync('op1', async () => sleep(10));
      await monitor.timeAsync('op2', async () => sleep(10));

      const allStats = monitor.getAllStats();
      expect(Object.keys(allStats)).toContain('op1');
      expect(Object.keys(allStats)).toContain('op2');
    });
  });

  describe('Report Generation', () => {
    it('should generate report', async () => {
      await monitor.timeAsync('test', async () => sleep(10));

      const report = monitor.generateReport();
      expect(report).toContain('TestMonitor');
      expect(report).toContain('test');
      expect(report).toContain('Count');
      expect(report).toContain('Avg');
    });
  });

  describe('Clear', () => {
    it('should clear all timings', async () => {
      await monitor.timeAsync('test', async () => sleep(10));
      expect(monitor.getStats('test')).not.toBeNull();

      monitor.clear();
      expect(monitor.getStats('test')).toBeNull();
    });
  });
});

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
