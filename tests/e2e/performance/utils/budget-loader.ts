import * as fs from 'fs';
import * as path from 'path';

export interface PerformanceBudget {
  metric: string;
  budget: number;
  unit: 'ms' | 'kb' | 'count' | 'score' | 'cls';
}

export interface PageBudget {
  path: string;
  budgets: PerformanceBudget[];
}

export interface BudgetConfig {
  global: PerformanceBudget[];
  pages?: PageBudget[];
}

export function loadBudgetConfig(configPath?: string): BudgetConfig {
  const defaultPath = path.join(process.cwd(), 'performance-budgets.json');
  const finalPath = configPath || defaultPath;
  
  if (!fs.existsSync(finalPath)) {
    // Return default budgets if file doesn't exist
    return {
      global: [
        { metric: 'FCP', budget: 1800, unit: 'ms' },
        { metric: 'LCP', budget: 2500, unit: 'ms' },
        { metric: 'CLS', budget: 0.1, unit: 'cls' },
        { metric: 'TTFB', budget: 800, unit: 'ms' },
        { metric: 'totalBlockingTime', budget: 300, unit: 'ms' },
        { metric: 'bundleSize', budget: 300, unit: 'kb' },
        { metric: 'requestCount', budget: 50, unit: 'count' }
      ]
    };
  }
  
  const content = fs.readFileSync(finalPath, 'utf-8');
  return JSON.parse(content);
}

export function getBudgetForMetric(
  config: BudgetConfig,
  metric: string,
  pagePath?: string
): PerformanceBudget | undefined {
  // Check page-specific budgets first
  if (pagePath && config.pages) {
    const pageBudget = config.pages.find(p => p.path === pagePath);
    if (pageBudget) {
      const budget = pageBudget.budgets.find(b => b.metric === metric);
      if (budget) return budget;
    }
  }
  
  // Fall back to global budgets
  return config.global.find(b => b.metric === metric);
}

export function checkBudget(
  value: number,
  budget: PerformanceBudget
): { passed: boolean; message: string } {
  const passed = value <= budget.budget;
  const percentage = ((value / budget.budget) * 100).toFixed(1);
  
  const message = passed
    ? `✓ ${budget.metric}: ${value}${budget.unit} (${percentage}% of budget)`
    : `✗ ${budget.metric}: ${value}${budget.unit} (${percentage}% of budget - OVER by ${value - budget.budget}${budget.unit})`;
  
  return { passed, message };
}

export function validateBudgets(
  metrics: Record<string, number>,
  config: BudgetConfig,
  pagePath?: string
): {
  passed: boolean;
  results: Array<{ metric: string; passed: boolean; message: string }>;
} {
  const results: Array<{ metric: string; passed: boolean; message: string }> = [];
  
  for (const [metric, value] of Object.entries(metrics)) {
    const budget = getBudgetForMetric(config, metric, pagePath);
    
    if (budget) {
      const result = checkBudget(value, budget);
      results.push({
        metric,
        ...result
      });
    }
  }
  
  const passed = results.every(r => r.passed);
  
  return { passed, results };
}

export function formatBudgetReport(
  results: Array<{ metric: string; passed: boolean; message: string }>
): string {
  const header = '\n=== Performance Budget Report ===\n';
  const details = results.map(r => r.message).join('\n');
  const summary = results.every(r => r.passed)
    ? '\n✅ All budgets passed!'
    : '\n❌ Some budgets exceeded!';
  
  return header + details + summary;
}

// Keep backward compatibility functions
export const performanceBudgets: Record<string, any> = {
  login: {
    fcp: 1500,
    lcp: 2500,
    tti: 3500,
    bundleSize: 500 * 1024 // 500KB
  },
  default: {
    fcp: 2000,
    lcp: 3000,
    tti: 4000,
    bundleSize: 1024 * 1024 // 1MB
  }
};

export function loadBudget(page: string): any {
  return performanceBudgets[page] || performanceBudgets.default;
}

export function getBudgetForPage(page: string): any {
  return loadBudget(page);
}

export function generateBudgetReport(metrics: any, budget: any): string {
  const report: string[] = ['Performance Budget Report'];
  report.push('========================');
  
  for (const [key, budgetValue] of Object.entries(budget)) {
    const actualValue = metrics[key];
    if (actualValue !== undefined && budgetValue !== undefined) {
      const status = actualValue <= budgetValue ? '✅' : '❌';
      report.push(`${status} ${key}: ${actualValue} / ${budgetValue}`);
    }
  }
  
  return report.join('\n');
}