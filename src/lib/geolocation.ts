/**
 * IP Geolocation service for session management
 * Uses ip-api.com free tier (45 requests per minute)
 */

import { logger } from './logger-v2'

/**
 * Geolocation data structure
 * @interface GeolocationData
 */
export interface GeolocationData {
  country?: string
  countryCode?: string
  region?: string
  regionName?: string
  city?: string
  zip?: string
  lat?: number
  lon?: number
  timezone?: string
  isp?: string
  org?: string
  as?: string
  query: string // IP address
  status: 'success' | 'fail'
  message?: string // Error message if status is 'fail'
}

/**
 * Cache for geolocation data to avoid hitting rate limits
 * Stores data for 24 hours
 */
const geoCache = new Map<string, { data: GeolocationData; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get geolocation data for an IP address
 * @param ip - IP address to lookup
 * @returns Geolocation data or null if lookup fails
 * 
 * @example
 * ```ts
 * const location = await getGeolocation('1.2.3.4');
 * if (location && location.status === 'success') {
 *   console.log(`User is from ${location.city}, ${location.country}`);
 * }
 * ```
 */
export async function getGeolocation(ip: string): Promise<GeolocationData | null> {
  // Check if IP is valid
  if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null // Skip private/local IPs
  }

  // Check cache first
  const cached = geoCache.get(ip)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.debug('Returning cached geolocation data', { ip })
    return cached.data
  }

  try {
    // Use ip-api.com free tier
    // Note: In production, consider using a paid service for higher rate limits
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`, {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: GeolocationData = await response.json()

    // Cache successful lookups
    if (data.status === 'success') {
      geoCache.set(ip, { data, timestamp: Date.now() })
      
      // Clean up old cache entries (keep max 1000 entries)
      if (geoCache.size > 1000) {
        const sortedEntries = Array.from(geoCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)
        
        // Remove oldest 100 entries
        for (let i = 0; i < 100; i++) {
          geoCache.delete(sortedEntries[i][0])
        }
      }
    }

    return data
  } catch (error) {
    logger.warn('Failed to fetch geolocation data', { 
      ip, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    })
    return null
  }
}

/**
 * Format geolocation data for display
 * @param geo - Geolocation data
 * @returns Formatted location string
 * 
 * @example
 * ```ts
 * const location = await getGeolocation(ip);
 * const formatted = formatLocation(location);
 * // Returns: "San Francisco, CA, United States"
 * ```
 */
export function formatLocation(geo: GeolocationData | null): string {
  if (!geo || geo.status !== 'success') {
    return 'Unknown'
  }

  const parts = []
  
  if (geo.city) parts.push(geo.city)
  if (geo.regionName && geo.regionName !== geo.city) {
    parts.push(geo.countryCode === 'US' ? geo.region : geo.regionName)
  }
  if (geo.country) parts.push(geo.country)
  
  return parts.join(', ') || 'Unknown'
}

/**
 * Get location summary for security display
 * @param geo - Geolocation data
 * @returns Location summary with ISP info
 * 
 * @example
 * ```ts
 * const summary = getLocationSummary(location);
 * // Returns: { location: "San Francisco, United States", isp: "Comcast" }
 * ```
 */
export function getLocationSummary(geo: GeolocationData | null): {
  location: string
  isp?: string
  suspicious?: boolean
} {
  if (!geo || geo.status !== 'success') {
    return { location: 'Unknown' }
  }

  const location = formatLocation(geo)
  
  return {
    location,
    isp: geo.isp || geo.org,
    // Flag potentially suspicious locations (customize based on your needs)
    suspicious: false // Could add logic to flag VPNs, TOR, etc.
  }
}