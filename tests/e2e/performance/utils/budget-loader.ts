export interface PerformanceBudget {
  fcp?: number
  lcp?: number
  tti?: number
  tbt?: number
  cls?: number
  bundleSize?: number
}

export const performanceBudgets: Record<string, PerformanceBudget> = {
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
}

export function loadBudget(page: string): PerformanceBudget {
  return performanceBudgets[page] || performanceBudgets.default
}

export function loadBudgetConfig(): Record<string, PerformanceBudget> {
  return performanceBudgets
}

export function getBudgetForPage(page: string): PerformanceBudget {
  return loadBudget(page)
}

export function generateBudgetReport(metrics: any, budget: PerformanceBudget): string {
  const report: string[] = ['Performance Budget Report']
  report.push('========================')
  
  for (const [key, budgetValue] of Object.entries(budget)) {
    const actualValue = metrics[key]
    if (actualValue !== undefined && budgetValue !== undefined) {
      const status = actualValue <= budgetValue ? '✅' : '❌'
      report.push(`${status} ${key}: ${actualValue} / ${budgetValue}`)
    }
  }
  
  return report.join('\n')
}