import fs from 'fs';
import path from 'path';
import { SystemMonitor } from '../src/utils/errorRecovery';

interface MonitoringSummary {
  totalMonitoringTime: number;
  averageCpuUsage: number;
  peakCpuUsage: number;
  averageMemoryUsage: number;
  peakMemoryUsage: number;
  loadAverage: number[];
  alerts: string[];
}

type MonitoringMetric = {
  timestamp: string;
  cpu: number;
  memory: number;
  loadAverage: number[];
  freeMemory: number;
  totalMemory: number;
};

class TestMonitoring {
  private monitor: SystemMonitor;
  private resultsDir = path.join(process.cwd(), 'data', 'results');
  private reportsDir = path.join(process.cwd(), 'reports');

  constructor() {
    this.monitor = new SystemMonitor();
    this.ensureDirectories();
  }

  private ensureDirectories() {
    [this.resultsDir, this.reportsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runMonitoringSession(durationMinutes: number = 5) {
    console.log(`🔍 Starting monitoring session for ${durationMinutes} minutes...`);

    this.monitor.startMonitoring();

    // Wait for the monitoring period
    await new Promise((resolve) => setTimeout(resolve, durationMinutes * 60 * 1000));

    this.monitor.stopMonitoring();

    // Generate reports
    await this.generateReports();
  }

  async generateReports() {
    console.log('📊 Generating monitoring reports...');

    const metrics = this.monitor.getMetrics();

    if (metrics.length === 0) {
      console.log('⚠️ No monitoring data available.');
      return;
    }

    const summary = this.calculateSummary(metrics);

    // Export in multiple formats
    this.exportJSON(summary, metrics);
    this.exportCSV(metrics);
    this.exportHTML(summary, metrics);

    console.log('✅ Monitoring reports generated successfully!');
    console.log(`📊 Average CPU: ${(summary.averageCpuUsage * 100).toFixed(1)}%`);
    console.log(`🧠 Peak Memory: ${(summary.peakMemoryUsage * 100).toFixed(1)}%`);
  }

  private calculateSummary(metrics: MonitoringMetric[]): MonitoringSummary {
    const cpuUsages = metrics.map((m) => m.cpu);
    const memoryUsages = metrics.map((m) => m.memory);

    const averageCpuUsage = cpuUsages.reduce((a, b) => a + b, 0) / cpuUsages.length;
    const peakCpuUsage = Math.max(...cpuUsages);
    const averageMemoryUsage = memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length;
    const peakMemoryUsage = Math.max(...memoryUsages);

    const totalMonitoringTime = metrics.length * 5; // 5 second intervals
    const loadAverage = metrics[metrics.length - 1]?.loadAverage || [];

    const alerts: string[] = [];
    if (peakCpuUsage > 0.8) alerts.push('High CPU usage detected');
    if (peakMemoryUsage > 0.9) alerts.push('High memory usage detected');
    if (loadAverage[0] > 2) alerts.push('High system load detected');

    return {
      totalMonitoringTime,
      averageCpuUsage,
      peakCpuUsage,
      averageMemoryUsage,
      peakMemoryUsage,
      loadAverage,
      alerts,
    };
  }

  private exportJSON(summary: MonitoringSummary, metrics: MonitoringMetric[]) {
    const data = { summary, metrics };
    const filePath = path.join(this.reportsDir, 'monitoring.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`📄 JSON monitoring report saved to: ${filePath}`);
  }

  private exportCSV(metrics: MonitoringMetric[]) {
    const csvHeader =
      'Timestamp,CPU Usage,Memory Usage,Load Average 1min,Load Average 5min,Load Average 15min,Free Memory (bytes),Total Memory (bytes)\n';
    const csvRows = metrics
      .map(
        (m) =>
          `"${m.timestamp}",${m.cpu},${m.memory},${m.loadAverage[0]},${m.loadAverage[1]},${m.loadAverage[2]},${m.freeMemory},${m.totalMemory}`,
      )
      .join('\n');
    const csvContent = csvHeader + csvRows;
    const filePath = path.join(this.reportsDir, 'monitoring.csv');
    fs.writeFileSync(filePath, csvContent);
    console.log(`📊 CSV monitoring report saved to: ${filePath}`);
  }

  private exportHTML(summary: MonitoringSummary, metrics: MonitoringMetric[]) {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>System Monitoring Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .summary { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
    .metric { display: inline-block; margin: 10px; text-align: center; }
    .metric-value { font-size: 2em; font-weight: bold; }
    .alert { color: red; font-weight: bold; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .high { background-color: #ffe6e6; }
  </style>
</head>
<body>
  <h1>System Monitoring Dashboard</h1>
  <div class="summary">
    <h2>Summary</h2>
    <div class="metric">
      <div class="metric-value">${summary.totalMonitoringTime}s</div>
      <div>Total Monitoring Time</div>
    </div>
    <div class="metric">
      <div class="metric-value">${(summary.averageCpuUsage * 100).toFixed(1)}%</div>
      <div>Average CPU Usage</div>
    </div>
    <div class="metric">
      <div class="metric-value">${(summary.peakCpuUsage * 100).toFixed(1)}%</div>
      <div>Peak CPU Usage</div>
    </div>
    <div class="metric">
      <div class="metric-value">${(summary.averageMemoryUsage * 100).toFixed(1)}%</div>
      <div>Average Memory Usage</div>
    </div>
    <div class="metric">
      <div class="metric-value">${(summary.peakMemoryUsage * 100).toFixed(1)}%</div>
      <div>Peak Memory Usage</div>
    </div>
    ${
      summary.alerts.length > 0
        ? `
    <div class="alert">
      <h3>Alerts:</h3>
      <ul>
        ${summary.alerts.map((alert) => `<li>${alert}</li>`).join('')}
      </ul>
    </div>
    `
        : ''
    }
  </div>
  <h2>Monitoring Data</h2>
  <table>
    <thead>
      <tr>
        <th>Timestamp</th>
        <th>CPU Usage</th>
        <th>Memory Usage</th>
        <th>Load Average (1min)</th>
        <th>Free Memory</th>
      </tr>
    </thead>
    <tbody>
      ${metrics
        .map(
          (m) => `
        <tr class="${m.cpu > 0.8 || m.memory > 0.9 ? 'high' : ''}">
          <td>${m.timestamp}</td>
          <td>${(m.cpu * 100).toFixed(1)}%</td>
          <td>${(m.memory * 100).toFixed(1)}%</td>
          <td>${m.loadAverage[0].toFixed(2)}</td>
          <td>${(m.freeMemory / 1024 / 1024 / 1024).toFixed(2)} GB</td>
        </tr>
      `,
        )
        .join('')}
    </tbody>
  </table>
</body>
</html>`;
    const filePath = path.join(this.reportsDir, 'monitoring.html');
    fs.writeFileSync(filePath, html);
    console.log(`🌐 HTML monitoring dashboard saved to: ${filePath}`);
  }
}

// CLI runner
if (require.main === module) {
  const monitoring = new TestMonitoring();
  const duration = parseInt(process.argv[2]) || 5;
  monitoring.runMonitoringSession(duration).catch(console.error);
}

export { TestMonitoring };
