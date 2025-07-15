import { Page, BrowserContext } from '@playwright/test';

/**
 * Network condition presets based on Chrome DevTools
 */
export const NetworkProfiles = {
  // No throttling
  'No throttling': {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  },
  
  // Mobile networks
  'Slow 3G': {
    offline: false,
    downloadThroughput: ((500 * 1000) / 8) * 0.8, // 500kb/s * 0.8
    uploadThroughput: ((500 * 1000) / 8) * 0.8,
    latency: 400 * 5, // 2000ms
  },
  
  'Fast 3G': {
    offline: false,
    downloadThroughput: ((1.6 * 1000 * 1000) / 8) * 0.9, // 1.6Mb/s * 0.9
    uploadThroughput: ((750 * 1000) / 8) * 0.9,
    latency: 150 * 3.75, // 562.5ms
  },
  
  'Slow 4G': {
    offline: false,
    downloadThroughput: ((3 * 1000 * 1000) / 8) * 0.9, // 3Mb/s * 0.9
    uploadThroughput: ((1.5 * 1000 * 1000) / 8) * 0.9,
    latency: 50 * 3, // 150ms
  },
  
  'Regular 4G': {
    offline: false,
    downloadThroughput: ((4 * 1000 * 1000) / 8) * 0.9, // 4Mb/s * 0.9
    uploadThroughput: ((3 * 1000 * 1000) / 8) * 0.9,
    latency: 50 * 1.75, // 87.5ms
  },
  
  // Fixed connections
  'WiFi': {
    offline: false,
    downloadThroughput: ((30 * 1000 * 1000) / 8) * 0.94, // 30Mb/s * 0.94
    uploadThroughput: ((15 * 1000 * 1000) / 8) * 0.94,
    latency: 5 * 2, // 10ms
  },
  
  'DSL': {
    offline: false,
    downloadThroughput: ((2 * 1000 * 1000) / 8) * 0.95, // 2Mb/s * 0.95
    uploadThroughput: ((1 * 1000 * 1000) / 8) * 0.95,
    latency: 25 * 2, // 50ms
  },
  
  'Cable': {
    offline: false,
    downloadThroughput: ((5 * 1000 * 1000) / 8) * 0.94, // 5Mb/s * 0.94
    uploadThroughput: ((1 * 1000 * 1000) / 8) * 0.94,
    latency: 14 * 2, // 28ms
  },
} as const;

export type NetworkProfileName = keyof typeof NetworkProfiles;

/**
 * CPU throttling multipliers
 */
export const CPUThrottling = {
  'No throttling': 1,
  'Low-end mobile': 6,
  'Mid-tier mobile': 4,
  'High-end mobile': 2,
} as const;

export type CPUThrottlingProfile = keyof typeof CPUThrottling;

/**
 * Apply network throttling to a page or context
 */
export async function throttleNetwork(
  page: Page | BrowserContext,
  profile: NetworkProfileName | 'custom',
  customSettings?: {
    downloadThroughput?: number;
    uploadThroughput?: number;
    latency?: number;
    offline?: boolean;
  }
): Promise<void> {
  let settings;
  
  if (profile === 'custom' && customSettings) {
    settings = {
      offline: customSettings.offline || false,
      downloadThroughput: customSettings.downloadThroughput || -1,
      uploadThroughput: customSettings.uploadThroughput || -1,
      latency: customSettings.latency || 0,
    };
  } else if (profile !== 'custom') {
    settings = NetworkProfiles[profile];
  } else {
    throw new Error('Custom profile selected but no custom settings provided');
  }

  // Apply throttling
  if ('page' in page) {
    // It's a Page
    await page.context().route('**/*', async route => {
      await route.continue();
    });
  }

  // Use CDP for network throttling
  const cdpSession = await (page as Page).context().newCDPSession(page as Page);
  await cdpSession.send('Network.emulateNetworkConditions', settings);
}

/**
 * Apply CPU throttling to a page
 */
export async function throttleCPU(
  page: Page,
  profile: CPUThrottlingProfile | number
): Promise<void> {
  const rate = typeof profile === 'number' ? profile : CPUThrottling[profile];
  
  const cdpSession = await page.context().newCDPSession(page);
  await cdpSession.send('Emulation.setCPUThrottlingRate', { rate });
}

/**
 * Device emulation presets
 */
export const DeviceProfiles = {
  'Desktop': {
    viewport: { width: 1920, height: 1080 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
  'Laptop': {
    viewport: { width: 1366, height: 768 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    deviceScaleFactor: 2,
    isMobile: false,
    hasTouch: false,
  },
  'Tablet': {
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  'Mobile': {
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
} as const;

export type DeviceProfileName = keyof typeof DeviceProfiles;

/**
 * Test under different network conditions
 */
export async function testWithNetworkConditions<T>(
  page: Page,
  profiles: NetworkProfileName[],
  testFn: (profile: NetworkProfileName) => Promise<T>
): Promise<Record<NetworkProfileName, T>> {
  const results = {} as Record<NetworkProfileName, T>;
  
  for (const profile of profiles) {
    await throttleNetwork(page, profile);
    results[profile] = await testFn(profile);
    // Reset to no throttling between tests
    await throttleNetwork(page, 'No throttling');
  }
  
  return results;
}

/**
 * Measure network resource metrics
 */
export async function measureNetworkMetrics(page: Page): Promise<{
  totalRequests: number;
  totalSize: number;
  totalDuration: number;
  byType: Record<string, { count: number; size: number }>;
}> {
  const metrics = {
    totalRequests: 0,
    totalSize: 0,
    totalDuration: 0,
    byType: {} as Record<string, { count: number; size: number }>,
  };

  // Track network requests
  const requests: Array<{ type: string; size: number; duration: number }> = [];
  
  page.on('response', response => {
    const request = response.request();
    const type = request.resourceType();
    const size = response.headers()['content-length'] 
      ? parseInt(response.headers()['content-length']) 
      : 0;
    
    const timing = response.timing();
    const duration = timing ? timing.responseEnd : 0;
    
    requests.push({ type, size, duration });
  });

  // Wait for page to load
  await page.goto(page.url());
  await page.waitForLoadState('networkidle');

  // Calculate metrics
  requests.forEach(({ type, size, duration }) => {
    metrics.totalRequests++;
    metrics.totalSize += size;
    metrics.totalDuration = Math.max(metrics.totalDuration, duration);
    
    if (!metrics.byType[type]) {
      metrics.byType[type] = { count: 0, size: 0 };
    }
    metrics.byType[type].count++;
    metrics.byType[type].size += size;
  });

  return metrics;
}

/**
 * Simulate offline mode
 */
export async function goOffline(page: Page): Promise<void> {
  await page.context().setOffline(true);
}

/**
 * Go back online
 */
export async function goOnline(page: Page): Promise<void> {
  await page.context().setOffline(false);
}

/**
 * Test performance under various conditions
 */
export interface PerformanceTestConditions {
  network?: NetworkProfileName;
  cpu?: CPUThrottlingProfile;
  device?: DeviceProfileName;
}

export async function runWithConditions<T>(
  page: Page,
  conditions: PerformanceTestConditions,
  testFn: () => Promise<T>
): Promise<T> {
  // Apply network throttling
  if (conditions.network) {
    await throttleNetwork(page, conditions.network);
  }
  
  // Apply CPU throttling
  if (conditions.cpu) {
    await throttleCPU(page, conditions.cpu);
  }
  
  // Apply device emulation
  if (conditions.device) {
    const deviceSettings = DeviceProfiles[conditions.device];
    await page.setViewportSize(deviceSettings.viewport);
    await page.setExtraHTTPHeaders({
      'User-Agent': deviceSettings.userAgent,
    });
  }
  
  try {
    return await testFn();
  } finally {
    // Reset throttling
    if (conditions.network) {
      await throttleNetwork(page, 'No throttling');
    }
    if (conditions.cpu) {
      await throttleCPU(page, 'No throttling');
    }
  }
}

/**
 * Format network profile information
 */
export function formatNetworkProfile(profile: NetworkProfileName): string {
  const settings = NetworkProfiles[profile];
  const download = settings.downloadThroughput > 0 
    ? `${Math.round(settings.downloadThroughput * 8 / 1000)}kb/s` 
    : 'unlimited';
  const upload = settings.uploadThroughput > 0 
    ? `${Math.round(settings.uploadThroughput * 8 / 1000)}kb/s` 
    : 'unlimited';
  const latency = `${settings.latency}ms`;
  
  return `${profile} (↓${download} ↑${upload} ~${latency})`;
}