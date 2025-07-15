import { Page } from '@playwright/test';
import { PerformanceMetrics, PerformanceBudget } from './performance-helpers';
import { NetworkProfileName, DeviceProfileName } from './network-emulation';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Budget configuration interfaces
 */
export interface WebVitalsBudget {
  FCP: number;
  LCP: number;
  TTI: number;
  TBT: number;
  CLS: number;
  INP: number;
  TTFB: number;
}

export interface ResourceBudget {
  totalSize: number;
  scriptSize: number;
  styleSize: number;
  imageSize: number;
  fontSize: number;
}

export interface PageBudget {
  webVitals: WebVitalsBudget;
  resources?: ResourceBudget;
}

export interface BudgetConfig {
  global?: {
    webVitals: WebVitalsBudget;
    resources: ResourceBudget;
  };
  pages?: Record<string, PageBudget | Record<string, Partial<WebVitalsBudget>>>;
  percentiles?: {
    p75: { webVitals: Partial<WebVitalsBudget> };
    p90: { webVitals: Partial<WebVitalsBudget> };
    p95: { webVitals: Partial<WebVitalsBudget> };
  };
  thresholds?: {
    good: WebVitalsBudget;
    needsImprovement: WebVitalsBudget;
  };
  networkConditions?: Record<string, PageBudget>;
  deviceProfiles?: Record<string, PageBudget & { cpuThrottling?: number }>;
  interactionBudgets?: Record<string, { good: number; needsImprovement: number; poor: number }>;
}

/**
 * Load performance budget configuration from JSON file
 */
export function loadBudgetConfig(filePath: string): BudgetConfig {
  const absolutePath = path.resolve(process.cwd(), filePath);
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Budget file not found: ${absolutePath}`);
  }
  
  const content = fs.readFileSync(absolutePath, 'utf-8');
  return JSON.parse(content);
}

/**
 * Get budget for specific page and conditions
 */
export function getBudgetForPage(
  config: BudgetConfig,
  pageName: string,
  options?: {
    network?: NetworkProfileName;
    device?: 'mobile' | 'desktop';
    percentile?: 'p75' | 'p90' | 'p95';
  }
): PerformanceBudget {
  let budget: PerformanceBudget = {};
  
  // Start with global budget if available
  if (config.global?.webVitals) {
    budget = { ...config.global.webVitals };
  }
  
  // Apply page-specific budget
  if (config.pages?.[pageName]) {
    const pageBudget = config.pages[pageName];
    
    // Handle different budget formats
    if ('webVitals' in pageBudget) {
      budget = { ...budget, ...pageBudget.webVitals };
    } else if (options?.network && pageBudget[options.network]) {
      // Network-specific budget for the page
      budget = { ...budget, ...(pageBudget[options.network] as Partial<WebVitalsBudget>) };
    }
  }
  
  // Apply network condition budget if specified
  if (options?.network && config.networkConditions?.[options.network]) {
    const networkBudget = config.networkConditions[options.network].webVitals;
    budget = { ...budget, ...networkBudget };
  }
  
  // Apply percentile budget if specified
  if (options?.percentile && config.percentiles?.[options.percentile]) {
    const percentileBudget = config.percentiles[options.percentile].webVitals;
    budget = { ...budget, ...percentileBudget };
  }
  
  return budget;
}

/**
 * Load appropriate budget file based on device type
 */
export function loadBudgetForDevice(device: 'mobile' | 'desktop' | 'all'): BudgetConfig {
  const budgetPath = {
    mobile: 'tests/e2e/performance/budgets/mobile-budgets.json',
    desktop: 'tests/e2e/performance/budgets/desktop-budgets.json',
    all: 'performance-budgets.json'
  };
  
  return loadBudgetConfig(budgetPath[device]);
}

/**
 * Assert metrics against multiple budget configurations
 */
export function assertBudgets(
  metrics: PerformanceMetrics,
  budgets: PerformanceBudget[]
): {
  passed: boolean;
  violations: Array<{
    budget: PerformanceBudget;
    violations: string[];
  }>;
} {
  const results = budgets.map(budget => {
    const violations: string[] = [];
    
    Object.entries(budget).forEach(([metric, threshold]) => {
      const actualValue = metrics[metric as keyof PerformanceMetrics];
      if (actualValue > threshold) {
        violations.push(
          `${metric}: ${actualValue}${metric === 'CLS' ? '' : 'ms'} > ${threshold}${metric === 'CLS' ? '' : 'ms'}`
        );
      }
    });
    
    return { budget, violations };
  });
  
  return {
    passed: results.every(r => r.violations.length === 0),
    violations: results.filter(r => r.violations.length > 0)
  };
}

/**
 * Get performance rating based on thresholds
 */
export function getPerformanceRating(
  metrics: PerformanceMetrics,
  config: BudgetConfig
): Record<keyof PerformanceMetrics, 'good' | 'needs-improvement' | 'poor'> {
  const ratings: any = {};
  
  if (!config.thresholds) {
    throw new Error('No thresholds defined in budget config');
  }
  
  const metricKeys = Object.keys(metrics) as Array<keyof PerformanceMetrics>;
  
  metricKeys.forEach(metric => {
    const value = metrics[metric];
    const goodThreshold = config.thresholds!.good[metric];
    const needsImprovementThreshold = config.thresholds!.needsImprovement[metric];
    
    if (value <= goodThreshold) {
      ratings[metric] = 'good';
    } else if (value <= needsImprovementThreshold) {
      ratings[metric] = 'needs-improvement';
    } else {
      ratings[metric] = 'poor';
    }
  });
  
  return ratings;
}

/**
 * Generate budget report
 */
export function generateBudgetReport(
  metrics: PerformanceMetrics,
  budget: PerformanceBudget,
  pageName: string,
  conditions?: {
    network?: NetworkProfileName;
    device?: DeviceProfileName;
  }
): string {
  let report = `\\nPerformance Budget Report: ${pageName}\\n`;
  report += '='.repeat(50) + '\\n';
  
  if (conditions) {
    report += `Conditions: ${conditions.device || 'default'} device, ${conditions.network || 'default'} network\\n`;
    report += '-'.repeat(50) + '\\n';
  }
  
  const metricKeys = Object.keys(budget) as Array<keyof PerformanceBudget>;
  
  metricKeys.forEach(metric => {
    const actual = metrics[metric];
    const threshold = budget[metric]!;
    const unit = metric === 'CLS' ? '' : 'ms';
    const status = actual <= threshold ? '✅' : '❌';
    const percentage = ((actual / threshold) * 100).toFixed(1);
    
    report += `${status} ${metric}: ${actual}${unit} / ${threshold}${unit} (${percentage}%)\\n`;
  });
  
  return report;
}

/**
 * Load and validate all budget files
 */
export async function validateBudgetFiles(): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];
  const budgetFiles = [
    'performance-budgets.json',
    'tests/e2e/performance/budgets/mobile-budgets.json',
    'tests/e2e/performance/budgets/desktop-budgets.json'
  ];
  
  for (const file of budgetFiles) {
    try {
      const config = loadBudgetConfig(file);
      
      // Validate required fields
      if (!config.pages && !config.global && !config.networkConditions) {
        errors.push(`${file}: Must have at least one of: pages, global, or networkConditions`);
      }
      
      // Validate metric values
      const validateMetrics = (metrics: any, context: string) => {
        const validMetrics = ['FCP', 'LCP', 'TTI', 'TBT', 'CLS', 'INP', 'TTFB'];
        
        Object.entries(metrics).forEach(([key, value]) => {
          if (validMetrics.includes(key)) {
            if (typeof value !== 'number' || value < 0) {
              errors.push(`${file} - ${context}: ${key} must be a positive number`);
            }
          }
        });
      };
      
      // Check global budgets
      if (config.global?.webVitals) {
        validateMetrics(config.global.webVitals, 'global.webVitals');
      }
      
      // Check page budgets
      if (config.pages) {
        Object.entries(config.pages).forEach(([page, budget]) => {
          if ('webVitals' in budget) {
            validateMetrics(budget.webVitals, `pages.${page}.webVitals`);
          }
        });
      }
    } catch (error) {
      errors.push(`${file}: ${error}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}