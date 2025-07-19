/**
 * Geolocation service for Netlify Functions
 * Uses ip-api.com free tier (45 requests per minute)
 */

import { createLogger } from './logger'

const logger = createLogger('geolocation')

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
  query: string
  status: 'success' | 'fail'
  message?: string
}

/**
 * Simple in-memory cache for geolocation data
 * Stores data for 24 hours
 */
const geoCache = new Map<string, { data: GeolocationData; timestamp: number }>()
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Get geolocation data for an IP address
 */
export async function getGeolocation(ip: string): Promise<GeolocationData | null> {
  // Check if IP is valid
  if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null // Skip private/local IPs
  }

  // Check cache first
  const cached = geoCache.get(ip)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.info('Returning cached geolocation data', { ip })
    return cached.data
  }

  try {
    // Use ip-api.com free tier
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