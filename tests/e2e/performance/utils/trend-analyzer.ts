import * as fs from 'fs';
import * as path from 'path';
import { PerformanceMetrics } from './performance-helpers';
import { PerformanceReport } from './performance-reporter';

export interface HistoricalDataPoint {
  timestamp: string;
  metrics: PerformanceMetrics;
  metadata: {
    url: string;
    device: string;
    network: string;
    commit?: string;
    branch?: string;
    buildId?: string;
  };
}

export interface TrendAnalysis {
  metric: keyof PerformanceMetrics;
  trend: 'improving' | 'degrading' | 'stable' | 'volatile';
  changePercent: number;
  currentValue: number;
  previousValue: number;
  averageValue: number;
  standardDeviation: number;
  confidence: number;
}

export interface RegressionAlert {
  metric: keyof PerformanceMetrics;
  severity: 'critical' | 'warning' | 'minor';
  currentValue: number;
  baselineValue: number;
  threshold: number;
  changePercent: number;
  message: string;
}

export interface PerformanceBaseline {
  version: string;
  createdAt: string;
  metrics: Record<string, PerformanceMetrics>;
  thresholds: Record<keyof PerformanceMetrics, { warning: number; critical: number }>;
}

export class TrendAnalyzer {
  private dataDir: string;
  private historyFile: string;
  private baselineFile: string;
  private history: HistoricalDataPoint[] = [];
  private baseline: PerformanceBaseline | null = null;

  constructor(dataDir: string = 'test-results/performance/history') {
    this.dataDir = dataDir;
    this.historyFile = path.join(dataDir, 'performance-history.json');
    this.baselineFile = path.join(dataDir, 'performance-baseline.json');
    this.ensureDataDir();
    this.loadHistory();
    this.loadBaseline();
  }

  private ensureDataDir(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  private loadHistory(): void {
    if (fs.existsSync(this.historyFile)) {
      try {
        const data = fs.readFileSync(this.historyFile, 'utf-8');
        this.history = JSON.parse(data);
      } catch (error) {
        console.error('Failed to load history:', error);
        this.history = [];
      }
    }
  }

  private loadBaseline(): void {
    if (fs.existsSync(this.baselineFile)) {
      try {
        const data = fs.readFileSync(this.baselineFile, 'utf-8');
        this.baseline = JSON.parse(data);
      } catch (error) {
        console.error('Failed to load baseline:', error);
        this.baseline = null;
      }
    }
  }

  private saveHistory(): void {
    fs.writeFileSync(this.historyFile, JSON.stringify(this.history, null, 2));
  }

  private saveBaseline(): void {
    if (this.baseline) {
      fs.writeFileSync(this.baselineFile, JSON.stringify(this.baseline, null, 2));
    }
  }

  /**
   * Add performance data to history
   */
  addDataPoint(report: PerformanceReport, metadata?: Partial<HistoricalDataPoint['metadata']>): void {
    const dataPoint: HistoricalDataPoint = {
      timestamp: report.timestamp,
      metrics: report.metrics,
      metadata: {
        url: report.url,
        device: report.device,
        network: report.network,
        ...metadata,
      },
    };
    
    this.history.push(dataPoint);
    this.saveHistory();
  }

  /**
   * Analyze trends for all metrics
   */
  analyzeTrends(
    url?: string,
    device?: string,
    lookbackDays: number = 7
  ): Record<keyof PerformanceMetrics, TrendAnalysis> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - lookbackDays);
    
    // Filter relevant data points
    const relevantData = this.history.filter(point => {
      const pointDate = new Date(point.timestamp);
      const matchesUrl = !url || point.metadata.url === url;
      const matchesDevice = !device || point.metadata.device === device;
      return pointDate >= cutoffDate && matchesUrl && matchesDevice;
    });
    
    if (relevantData.length < 2) {
      throw new Error('Insufficient data for trend analysis');
    }
    
    const metrics: Array<keyof PerformanceMetrics> = ['FCP', 'LCP', 'TTI', 'TBT', 'CLS', 'INP', 'TTFB'];
    const analyses: Record<keyof PerformanceMetrics, TrendAnalysis> = {} as any;
    
    metrics.forEach(metric => {
      analyses[metric] = this.analyzeMetricTrend(metric, relevantData);
    });
    
    return analyses;
  }

  private analyzeMetricTrend(
    metric: keyof PerformanceMetrics,
    data: HistoricalDataPoint[]
  ): TrendAnalysis {
    const values = data.map(d => d.metrics[metric]);
    const timestamps = data.map(d => new Date(d.timestamp).getTime());
    
    // Calculate statistics
    const currentValue = values[values.length - 1];
    const previousValue = values[values.length - 2];
    const averageValue = values.reduce((a, b) => a + b, 0) / values.length;
    const standardDeviation = this.calculateStandardDeviation(values);
    
    // Calculate linear regression
    const regression = this.calculateLinearRegression(timestamps, values);
    const changePercent = ((currentValue - previousValue) / previousValue) * 100;
    
    // Determine trend
    let trend: TrendAnalysis['trend'];
    const coefficientOfVariation = standardDeviation / averageValue;
    
    if (coefficientOfVariation > 0.3) {
      trend = 'volatile';
    } else if (regression.slope < -0.01) {
      trend = 'improving';
    } else if (regression.slope > 0.01) {
      trend = 'degrading';
    } else {
      trend = 'stable';
    }
    
    // Calculate confidence (0-1)
    const confidence = Math.max(0, Math.min(1, regression.r2));
    
    return {
      metric,
      trend,
      changePercent,
      currentValue,
      previousValue,
      averageValue,
      standardDeviation,
      confidence,
    };
  }

  /**
   * Detect performance regressions
   */
  detectRegressions(
    currentMetrics: PerformanceMetrics,
    url: string,
    device: string = 'desktop'
  ): RegressionAlert[] {
    const alerts: RegressionAlert[] = [];
    
    // Compare against baseline if available
    if (this.baseline && this.baseline.metrics[`${url}_${device}`]) {
      const baselineMetrics = this.baseline.metrics[`${url}_${device}`];
      
      Object.entries(currentMetrics).forEach(([metric, value]) => {
        const baselineValue = baselineMetrics[metric as keyof PerformanceMetrics];
        const threshold = this.baseline!.thresholds[metric as keyof PerformanceMetrics];
        
        if (!threshold) return;
        
        const changePercent = ((value - baselineValue) / baselineValue) * 100;
        
        if (changePercent > threshold.critical) {
          alerts.push({
            metric: metric as keyof PerformanceMetrics,
            severity: 'critical',
            currentValue: value,
            baselineValue,
            threshold: threshold.critical,
            changePercent,
            message: `${metric} has degraded by ${changePercent.toFixed(1)}% (critical threshold: ${threshold.critical}%)`,
          });
        } else if (changePercent > threshold.warning) {
          alerts.push({
            metric: metric as keyof PerformanceMetrics,
            severity: 'warning',
            currentValue: value,
            baselineValue,
            threshold: threshold.warning,
            changePercent,
            message: `${metric} has degraded by ${changePercent.toFixed(1)}% (warning threshold: ${threshold.warning}%)`,
          });
        }
      });
    }
    
    // Also check against recent history
    const recentData = this.getRecentData(url, device, 7);
    if (recentData.length > 0) {
      const recentAverages = this.calculateAverages(recentData.map(d => d.metrics));
      
      Object.entries(currentMetrics).forEach(([metric, value]) => {
        const avgValue = recentAverages[metric as keyof PerformanceMetrics];
        const stdDev = this.calculateStandardDeviation(
          recentData.map(d => d.metrics[metric as keyof PerformanceMetrics])
        );
        
        // Alert if current value is more than 2 standard deviations worse than average
        if (value > avgValue + 2 * stdDev) {
          const changePercent = ((value - avgValue) / avgValue) * 100;
          
          alerts.push({
            metric: metric as keyof PerformanceMetrics,
            severity: 'warning',
            currentValue: value,
            baselineValue: avgValue,
            threshold: 2 * stdDev,
            changePercent,
            message: `${metric} is ${changePercent.toFixed(1)}% worse than 7-day average (statistical anomaly)`,
          });
        }
      });
    }
    
    return alerts;
  }

  /**
   * Update or create baseline
   */
  updateBaseline(
    metrics: Record<string, PerformanceMetrics>,
    version: string = '1.0.0'
  ): void {
    this.baseline = {
      version,
      createdAt: new Date().toISOString(),
      metrics,
      thresholds: {
        FCP: { warning: 20, critical: 50 },
        LCP: { warning: 20, critical: 50 },
        TTI: { warning: 20, critical: 50 },
        TBT: { warning: 30, critical: 100 },
        CLS: { warning: 30, critical: 100 },
        INP: { warning: 20, critical: 50 },
        TTFB: { warning: 20, critical: 50 },
      },
    };
    
    this.saveBaseline();
  }

  /**
   * Get performance forecast
   */
  forecast(
    metric: keyof PerformanceMetrics,
    url: string,
    device: string,
    daysAhead: number = 7
  ): { value: number; confidence: number } {
    const data = this.getRecentData(url, device, 30);
    
    if (data.length < 10) {
      throw new Error('Insufficient data for forecasting');
    }
    
    const values = data.map(d => d.metrics[metric]);
    const timestamps = data.map(d => new Date(d.timestamp).getTime());
    
    const regression = this.calculateLinearRegression(timestamps, values);
    const futureTimestamp = Date.now() + daysAhead * 24 * 60 * 60 * 1000;
    
    const forecastValue = regression.intercept + regression.slope * futureTimestamp;
    const confidence = Math.max(0, Math.min(1, regression.r2));
    
    return {
      value: Math.max(0, forecastValue),
      confidence,
    };
  }

  /**
   * Compare two time periods
   */
  comparePeriods(
    startDate1: Date,
    endDate1: Date,
    startDate2: Date,
    endDate2: Date,
    url?: string,
    device?: string
  ): Record<keyof PerformanceMetrics, { period1: number; period2: number; change: number }> {
    const period1Data = this.history.filter(point => {
      const date = new Date(point.timestamp);
      return date >= startDate1 && date <= endDate1 &&
             (!url || point.metadata.url === url) &&
             (!device || point.metadata.device === device);
    });
    
    const period2Data = this.history.filter(point => {
      const date = new Date(point.timestamp);
      return date >= startDate2 && date <= endDate2 &&
             (!url || point.metadata.url === url) &&
             (!device || point.metadata.device === device);
    });
    
    const period1Avg = this.calculateAverages(period1Data.map(d => d.metrics));
    const period2Avg = this.calculateAverages(period2Data.map(d => d.metrics));
    
    const comparison: any = {};
    
    Object.keys(period1Avg).forEach(metric => {
      const key = metric as keyof PerformanceMetrics;
      comparison[key] = {
        period1: period1Avg[key],
        period2: period2Avg[key],
        change: ((period2Avg[key] - period1Avg[key]) / period1Avg[key]) * 100,
      };
    });
    
    return comparison;
  }

  private getRecentData(url: string, device: string, days: number): HistoricalDataPoint[] {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return this.history.filter(point => {
      const date = new Date(point.timestamp);
      return date >= cutoff &&
             point.metadata.url === url &&
             point.metadata.device === device;
    });
  }

  private calculateAverages(metrics: PerformanceMetrics[]): PerformanceMetrics {
    const sum = metrics.reduce((acc, m) => ({
      FCP: acc.FCP + m.FCP,
      LCP: acc.LCP + m.LCP,
      TTI: acc.TTI + m.TTI,
      TBT: acc.TBT + m.TBT,
      CLS: acc.CLS + m.CLS,
      INP: acc.INP + m.INP,
      TTFB: acc.TTFB + m.TTFB,
    }), { FCP: 0, LCP: 0, TTI: 0, TBT: 0, CLS: 0, INP: 0, TTFB: 0 });
    
    const count = metrics.length;
    return {
      FCP: sum.FCP / count,
      LCP: sum.LCP / count,
      TTI: sum.TTI / count,
      TBT: sum.TBT / count,
      CLS: sum.CLS / count,
      INP: sum.INP / count,
      TTFB: sum.TTFB / count,
    };
  }

  private calculateStandardDeviation(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance);
  }

  private calculateLinearRegression(
    x: number[],
    y: number[]
  ): { slope: number; intercept: number; r2: number } {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Calculate R-squared
    const yMean = sumY / n;
    const ssTotal = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const ssResidual = y.reduce((sum, yi, i) => {
      const yPred = slope * x[i] + intercept;
      return sum + Math.pow(yi - yPred, 2);
    }, 0);
    
    const r2 = 1 - (ssResidual / ssTotal);
    
    return { slope, intercept, r2 };
  }
}