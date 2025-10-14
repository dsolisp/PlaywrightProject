import { Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Retry decorator for flaky operations
export function retryOnFailure(maxRetries: number = 3, delay: number = 1000) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
      let lastError: Error;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;
          console.warn(`Attempt ${attempt}/${maxRetries} failed for ${propertyKey}:`, error);
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, delay * attempt));
          }
        }
      }
      throw lastError!;
    };

    return descriptor;
  };
}

// System monitoring utilities
export class SystemMonitor {
  private metrics: Array<{
    timestamp: string;
    cpu: number;
    memory: number;
    loadAverage: number[];
    freeMemory: number;
    totalMemory: number;
  }> = [];
  private monitoring = false;
  private intervalId?: NodeJS.Timeout;

  startMonitoring(intervalMs: number = 5000) {
    this.monitoring = true;
    console.log('🔍 Starting system monitoring...');

    this.intervalId = setInterval(() => {
      if (!this.monitoring) return;

      const metric = {
        timestamp: new Date().toISOString(),
        cpu: this.getCpuUsage(),
        memory: this.getMemoryUsage(),
        loadAverage: os.loadavg(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
      };

      this.metrics.push(metric);
    }, intervalMs);
  }

  stopMonitoring() {
    this.monitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('✅ System monitoring stopped.');
  }

  getMetrics() {
    return this.metrics;
  }

  private getCpuUsage(): number {
    // Simple CPU usage approximation
    const cpus = os.cpus();
    let totalIdle = 0;
    let totalTick = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTick += cpu.times[type as keyof typeof cpu.times];
      }
      totalIdle += cpu.times.idle;
    });

    return 1 - totalIdle / totalTick;
  }

  private getMemoryUsage(): number {
    const used = os.totalmem() - os.freemem();
    return used / os.totalmem();
  }

  async saveMetrics(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        {
          monitoring: {
            startTime: this.metrics[0]?.timestamp,
            endTime: this.metrics[this.metrics.length - 1]?.timestamp,
            duration: this.metrics.length * 5, // assuming 5s intervals
            totalSamples: this.metrics.length,
          },
          metrics: this.metrics,
          summary: this.calculateSummary(),
        },
        null,
        2,
      ),
    );

    console.log(`📊 System metrics saved to: ${filePath}`);
  }

  private calculateSummary() {
    if (this.metrics.length === 0) return {};

    const cpuUsages = this.metrics.map((m) => m.cpu);
    const memoryUsages = this.metrics.map((m) => m.memory);

    return {
      avgCpuUsage: cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length,
      maxCpuUsage: Math.max(...cpuUsages),
      avgMemoryUsage: memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length,
      maxMemoryUsage: Math.max(...memoryUsages),
      loadAverage: this.metrics[this.metrics.length - 1]?.loadAverage || [],
    };
  }
}

// Error recovery utilities
export class ErrorRecovery {
  private static screenshotCounter = 0;
  private static errorLog: Array<{
    timestamp: string;
    context: string;
    error: {
      name: string;
      message: string;
      stack?: string;
    };
    screenshot: string;
  }> = [];

  static async captureError(page: Page, error: Error, context: string = '') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const screenshotPath = path.join(
      'screenshots',
      'errors',
      `error-${timestamp}-${++this.screenshotCounter}.png`,
    );

    try {
      // Ensure directory exists
      const dir = path.dirname(screenshotPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await page.screenshot({ path: screenshotPath, fullPage: true });
      console.log(`📸 Error screenshot captured: ${screenshotPath}`);
    } catch (screenshotError) {
      console.warn('Failed to capture screenshot:', screenshotError);
    }

    // Log error
    const errorEntry = {
      timestamp: new Date().toISOString(),
      context,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      screenshot: screenshotPath,
    };

    this.errorLog.push(errorEntry);
    this.saveErrorLog();
  }

  static async attemptRecovery(page: Page, recoveryAction: () => Promise<void>) {
    try {
      console.log('🔄 Attempting error recovery...');
      await recoveryAction();
      console.log('✅ Recovery successful');
      return true;
    } catch (recoveryError) {
      console.warn('❌ Recovery failed:', recoveryError);
      return false;
    }
  }

  private static saveErrorLog() {
    const logPath = path.join('logs', 'error-recovery.log');
    const dir = path.dirname(logPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(logPath, JSON.stringify(this.errorLog, null, 2));
  }

  static getErrorLog() {
    return this.errorLog;
  }
}

// Enhanced test utilities with monitoring
export class EnhancedTestUtils {
  private monitor: SystemMonitor;

  constructor() {
    this.monitor = new SystemMonitor();
  }

  async runTestWithMonitoring(testFn: () => Promise<void>) {
    this.monitor.startMonitoring();

    try {
      await testFn();
    } finally {
      this.monitor.stopMonitoring();
      await this.monitor.saveMetrics('data/results/system-metrics.json');
    }
  }

  async runWithRetryAndRecovery(
    page: Page,
    operation: () => Promise<void>,
    maxRetries: number = 2,
    recoveryAction?: () => Promise<void>,
  ) {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await operation();
        return; // Success
      } catch (error) {
        lastError = error as Error;
        console.warn(`Operation failed (attempt ${attempt}/${maxRetries}):`, error);

        // Capture error
        await ErrorRecovery.captureError(page, lastError, `Attempt ${attempt}`);

        // Try recovery if provided
        if (recoveryAction && attempt < maxRetries) {
          const recovered = await ErrorRecovery.attemptRecovery(page, recoveryAction);
          if (recovered) {
            console.log('Retrying after successful recovery...');
            continue;
          }
        }

        // Wait before retry
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
        }
      }
    }

    throw lastError!;
  }
}
