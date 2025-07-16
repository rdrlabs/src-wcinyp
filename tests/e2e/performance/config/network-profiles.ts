/**
 * Network emulation profiles for Playwright performance testing
 * These profiles match Chrome DevTools network throttling presets
 */

export interface NetworkProfile {
  name: string;
  offline: boolean;
  downloadThroughput: number; // bytes/second
  uploadThroughput: number; // bytes/second
  latency: number; // milliseconds
}

export const NETWORK_PROFILES: Record<string, NetworkProfile> = {
  // No throttling
  'No throttling': {
    name: 'No throttling',
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0,
  },
  
  // Mobile networks
  'Slow 3G': {
    name: 'Slow 3G',
    offline: false,
    downloadThroughput: ((500 * 1000) / 8) * 0.8, // 500kb/s * 0.8
    uploadThroughput: ((500 * 1000) / 8) * 0.8,
    latency: 400 * 5, // 2000ms
  },
  
  'Fast 3G': {
    name: 'Fast 3G',
    offline: false,
    downloadThroughput: ((1.6 * 1000 * 1000) / 8) * 0.9, // 1.6Mb/s * 0.9
    uploadThroughput: ((750 * 1000) / 8) * 0.9,
    latency: 150 * 3.75, // 562.5ms
  },
  
  'Slow 4G': {
    name: 'Slow 4G',
    offline: false,
    downloadThroughput: ((3 * 1000 * 1000) / 8) * 0.9, // 3Mb/s * 0.9
    uploadThroughput: ((1.5 * 1000 * 1000) / 8) * 0.9,
    latency: 50 * 3, // 150ms
  },
  
  'Regular 4G': {
    name: 'Regular 4G',
    offline: false,
    downloadThroughput: ((4 * 1000 * 1000) / 8) * 0.9, // 4Mb/s * 0.9
    uploadThroughput: ((3 * 1000 * 1000) / 8) * 0.9,
    latency: 50 * 1.75, // 87.5ms
  },
  
  // Fixed connections
  'WiFi': {
    name: 'WiFi',
    offline: false,
    downloadThroughput: ((30 * 1000 * 1000) / 8) * 0.94, // 30Mb/s * 0.94
    uploadThroughput: ((15 * 1000 * 1000) / 8) * 0.94,
    latency: 5 * 2, // 10ms
  },
  
  'DSL': {
    name: 'DSL',
    offline: false,
    downloadThroughput: ((2 * 1000 * 1000) / 8) * 0.95, // 2Mb/s * 0.95
    uploadThroughput: ((1 * 1000 * 1000) / 8) * 0.95,
    latency: 25 * 2, // 50ms
  },
  
  'Cable': {
    name: 'Cable',
    offline: false,
    downloadThroughput: ((5 * 1000 * 1000) / 8) * 0.94, // 5Mb/s * 0.94
    uploadThroughput: ((1 * 1000 * 1000) / 8) * 0.94,
    latency: 14 * 2, // 28ms
  },
  
  'Fiber': {
    name: 'Fiber',
    offline: false,
    downloadThroughput: ((100 * 1000 * 1000) / 8) * 0.96, // 100Mb/s * 0.96
    uploadThroughput: ((100 * 1000 * 1000) / 8) * 0.96,
    latency: 2, // 2ms
  },
  
  // Offline
  'Offline': {
    name: 'Offline',
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
  },
};

/**
 * CPU throttling multipliers
 */
export const CPU_THROTTLING_PROFILES = {
  'No throttling': 1,
  'Low-end mobile': 6,
  'Mid-tier mobile': 4,
  'High-end mobile': 2,
  'Low-end desktop': 2,
} as const;

/**
 * Device viewport configurations
 */
export const DEVICE_VIEWPORTS = {
  // Mobile devices
  'iPhone SE': { width: 375, height: 667 },
  'iPhone 12': { width: 390, height: 844 },
  'iPhone 14 Pro Max': { width: 430, height: 932 },
  'Pixel 5': { width: 393, height: 851 },
  'Galaxy S21': { width: 360, height: 800 },
  
  // Tablets
  'iPad Mini': { width: 768, height: 1024 },
  'iPad Pro 11': { width: 834, height: 1194 },
  'iPad Pro 12.9': { width: 1024, height: 1366 },
  
  // Desktop
  'Desktop HD': { width: 1366, height: 768 },
  'Desktop Full HD': { width: 1920, height: 1080 },
  'Desktop 2K': { width: 2560, height: 1440 },
  'Desktop 4K': { width: 3840, height: 2160 },
} as const;

/**
 * Performance test configurations combining network, CPU, and device settings
 */
export const PERFORMANCE_SCENARIOS = {
  'Desktop Broadband': {
    network: NETWORK_PROFILES['WiFi'],
    cpu: CPU_THROTTLING_PROFILES['No throttling'],
    viewport: DEVICE_VIEWPORTS['Desktop Full HD'],
  },
  'Desktop Cable': {
    network: NETWORK_PROFILES['Cable'],
    cpu: CPU_THROTTLING_PROFILES['No throttling'],
    viewport: DEVICE_VIEWPORTS['Desktop HD'],
  },
  'Mobile 4G': {
    network: NETWORK_PROFILES['Regular 4G'],
    cpu: CPU_THROTTLING_PROFILES['Mid-tier mobile'],
    viewport: DEVICE_VIEWPORTS['iPhone 12'],
  },
  'Mobile 3G': {
    network: NETWORK_PROFILES['Fast 3G'],
    cpu: CPU_THROTTLING_PROFILES['Low-end mobile'],
    viewport: DEVICE_VIEWPORTS['Pixel 5'],
  },
  'Tablet WiFi': {
    network: NETWORK_PROFILES['WiFi'],
    cpu: CPU_THROTTLING_PROFILES['High-end mobile'],
    viewport: DEVICE_VIEWPORTS['iPad Pro 11'],
  },
  'Low-end Mobile': {
    network: NETWORK_PROFILES['Slow 3G'],
    cpu: CPU_THROTTLING_PROFILES['Low-end mobile'],
    viewport: DEVICE_VIEWPORTS['Galaxy S21'],
  },
} as const;

/**
 * Helper function to apply network profile to Playwright context
 */
export async function applyNetworkProfile(
  context: any,
  profile: NetworkProfile
): Promise<void> {
  const cdp = await context.newCDPSession(await context.pages()[0]);
  await cdp.send('Network.emulateNetworkConditions', profile);
}

/**
 * Helper function to apply CPU throttling to Playwright context
 */
export async function applyCPUThrottling(
  context: any,
  multiplier: number
): Promise<void> {
  const cdp = await context.newCDPSession(await context.pages()[0]);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: multiplier });
}