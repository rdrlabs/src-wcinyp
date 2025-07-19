import { Page, BrowserContext } from '@playwright/test';

export type NetworkProfile = 'Fast3G' | 'Slow3G' | 'Slow4G' | 'Fast4G' | 'WiFi' | 'Cable' | 'DSL' | 'Custom';

interface NetworkConditions {
  download: number; // bytes per second
  upload: number;   // bytes per second
  latency: number;  // milliseconds
  packetLoss?: number; // percentage (0-100)
}

const NETWORK_PROFILES: Record<NetworkProfile, NetworkConditions> = {
  'Fast3G': {
    download: 1.6 * 1024 * 1024 / 8, // 1.6 Mbps
    upload: 0.75 * 1024 * 1024 / 8,  // 750 Kbps
    latency: 150
  },
  'Slow3G': {
    download: 0.5 * 1024 * 1024 / 8,  // 500 Kbps
    upload: 0.5 * 1024 * 1024 / 8,   // 500 Kbps
    latency: 400
  },
  'Slow4G': {
    download: 1.5 * 1024 * 1024 / 8, // 1.5 Mbps
    upload: 0.5 * 1024 * 1024 / 8,   // 500 Kbps
    latency: 150
  },
  'Fast4G': {
    download: 4 * 1024 * 1024 / 8,   // 4 Mbps
    upload: 3 * 1024 * 1024 / 8,     // 3 Mbps
    latency: 70
  },
  'WiFi': {
    download: 30 * 1024 * 1024 / 8,  // 30 Mbps
    upload: 15 * 1024 * 1024 / 8,    // 15 Mbps
    latency: 20
  },
  'Cable': {
    download: 100 * 1024 * 1024 / 8, // 100 Mbps
    upload: 50 * 1024 * 1024 / 8,    // 50 Mbps
    latency: 10
  },
  'DSL': {
    download: 2 * 1024 * 1024 / 8,   // 2 Mbps
    upload: 1 * 1024 * 1024 / 8,     // 1 Mbps
    latency: 50
  },
  'Custom': {
    download: 0,
    upload: 0,
    latency: 0
  }
};

export async function throttleNetwork(
  page: Page,
  profile: NetworkProfile | NetworkConditions
): Promise<void> {
  const conditions = typeof profile === 'string' 
    ? NETWORK_PROFILES[profile] 
    : profile;
  
  const client = await page.context().newCDPSession(page);
  
  await client.send('Network.enable');
  await client.send('Network.emulateNetworkConditions', {
    offline: false,
    downloadThroughput: conditions.download,
    uploadThroughput: conditions.upload,
    latency: conditions.latency,
    connectionType: 'cellular4g'
  });
}

export async function clearNetworkThrottling(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  
  await client.send('Network.disable');
}

export async function emulateCPUThrottling(page: Page, slowdownFactor: number = 4): Promise<void> {
  const client = await page.context().newCDPSession(page);
  
  await client.send('Emulation.setCPUThrottlingRate', {
    rate: slowdownFactor
  });
}

export async function clearCPUThrottling(page: Page): Promise<void> {
  const client = await page.context().newCDPSession(page);
  
  await client.send('Emulation.setCPUThrottlingRate', {
    rate: 1
  });
}

export async function blockResources(
  page: Page,
  resourceTypes: string[] = ['image', 'media', 'font']
): Promise<void> {
  await page.route('**/*', (route) => {
    const resourceType = route.request().resourceType();
    if (resourceTypes.includes(resourceType)) {
      route.abort();
    } else {
      route.continue();
    }
  });
}

export async function simulateOffline(page: Page): Promise<void> {
  await page.context().setOffline(true);
}

export async function simulateOnline(page: Page): Promise<void> {
  await page.context().setOffline(false);
}

export async function measureNetworkActivity(page: Page): Promise<{
  requestCount: number;
  totalSize: number;
  requests: Array<{
    url: string;
    method: string;
    status: number;
    size: number;
    duration: number;
    type: string;
  }>;
}> {
  const requests: any[] = [];
  
  page.on('request', request => {
    requests.push({
      url: request.url(),
      method: request.method(),
      startTime: Date.now(),
      type: request.resourceType()
    });
  });
  
  page.on('response', response => {
    const request = requests.find(r => r.url === response.url());
    if (request) {
      request.status = response.status();
      request.size = Number(response.headers()['content-length'] || 0);
      request.duration = Date.now() - request.startTime;
    }
  });
  
  // Navigate and wait
  await page.goto(page.url(), { waitUntil: 'networkidle' });
  
  const totalSize = requests.reduce((sum, req) => sum + (req.size || 0), 0);
  
  return {
    requestCount: requests.length,
    totalSize,
    requests: requests.map(({ startTime, ...rest }) => rest)
  };
}

// Keep backward compatibility exports
export const networkProfiles = {
  'Fast 3G': NETWORK_PROFILES.Fast3G,
  'Slow 3G': NETWORK_PROFILES.Slow3G,
  'Offline': {
    offline: true,
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0
  },
  'No throttling': {
    offline: false,
    downloadThroughput: -1,
    uploadThroughput: -1,
    latency: 0
  }
};

export const NetworkProfiles = networkProfiles; // Alias for import compatibility

export async function emulateNetwork(page: any, profile: keyof typeof networkProfiles) {
  const conditions = networkProfiles[profile];
  if (conditions.offline) {
    await simulateOffline(page);
  } else if (conditions.downloadThroughput === -1) {
    await clearNetworkThrottling(page);
  } else {
    await throttleNetwork(page, conditions as NetworkConditions);
  }
}

export async function throttleCPU(page: any, rate: number | string) {
  const throttleRate = typeof rate === 'string' ? parseInt(rate) : rate;
  await emulateCPUThrottling(page, throttleRate);
}