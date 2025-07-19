/**
 * Central application configuration
 * All environment variables and configuration values should be accessed through this file
 */

interface AppConfig {
  // Core App Settings
  app: {
    name: string
    environment: 'development' | 'staging' | 'production' | 'test'
    url: string
  }

  // Logging Configuration
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    enableStructuredLogging: boolean
    enablePerformanceMetrics: boolean
    enableDevTools: boolean
    bufferSize: number
    enableRemoteLogging: boolean
    remoteLoggingEndpoint?: string
    enableErrorReporting: boolean
    sentryDsn?: string
    samplingRate: number
  }

  // Authentication Settings
  auth: {
    sessionDuration: {
      default: number // in days
      rememberMe: number // in days
    }
    magicLink: {
      expiryMinutes: number
    }
    rateLimit: {
      enabled: boolean
      maxAttempts: number
      windowSeconds: number
    }
  }

  // UI Settings
  ui: {
    notifications: {
      durationMs: number
    }
    animations: {
      transitionDurationMs: number
      preloadTimeMs: number
    }
  }

  // External URLs
  urls: {
    wcm: string
    nyp: string
    patientPortal: string
    insuranceInfo: string
    microsoft: {
      teams: string
      outlook: string
      myApps: string
    }
    social: {
      facebook: string
      twitter: string
      linkedin: string
      youtube: string
    }
  }

  // API Settings
  api: {
    timeout: number
    retryAttempts: number
    retryDelay: number
  }

  // NiiVue Brain Viewer Settings
  brainViewer: {
    scanDurations: number[]
    imageUrls: {
      mni152: string
      chrisT1: string
      chrisT2: string
      spm152: string
    }
  }

  // CORS Settings
  cors: {
    allowedOrigins: string[]
  }

  // Feature Flags
  features: {
    enableAnalytics: boolean
    enableErrorReporting: boolean
    maintenanceMode: boolean
  }
}

// Helper function to get environment variable with fallback
function getEnv(key: string, defaultValue: string): string {
  return process.env[key] || defaultValue
}

// Helper function to get boolean environment variable
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  return value.toLowerCase() === 'true'
}

// Helper function to get number environment variable
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key]
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

// Helper function to get array from comma-separated env var
function getEnvArray(key: string, defaultValue: string[]): string[] {
  const value = process.env[key]
  if (!value) return defaultValue
  return value.split(',').map(item => item.trim()).filter(Boolean)
}

// Create the configuration object
export const config: AppConfig = {
  app: {
    name: 'WCI@NYP',
    environment: (getEnv('NODE_ENV', 'development') as AppConfig['app']['environment']),
    url: getEnv('NEXT_PUBLIC_APP_URL', 'https://wcinyp.netlify.app')
  },

  logging: {
    level: (getEnv('LOG_LEVEL', 'info') as AppConfig['logging']['level']),
    enableStructuredLogging: getEnvBoolean('ENABLE_STRUCTURED_LOGGING', true),
    enablePerformanceMetrics: getEnvBoolean('ENABLE_PERFORMANCE_METRICS', true),
    enableDevTools: getEnv('NODE_ENV', 'development') === 'development',
    bufferSize: getEnvNumber('LOG_BUFFER_SIZE', 1000),
    enableRemoteLogging: getEnvBoolean('ENABLE_REMOTE_LOGGING', false),
    remoteLoggingEndpoint: getEnv('REMOTE_LOGGING_ENDPOINT', ''),
    enableErrorReporting: getEnvBoolean('ENABLE_ERROR_REPORTING', false),
    sentryDsn: getEnv('NEXT_PUBLIC_SENTRY_DSN', ''),
    samplingRate: parseFloat(getEnv('LOG_SAMPLING_RATE', '1.0'))
  },

  auth: {
    sessionDuration: {
      default: getEnvNumber('SESSION_DURATION_DAYS', 7),
      rememberMe: getEnvNumber('SESSION_DURATION_REMEMBER_ME_DAYS', 30)
    },
    magicLink: {
      expiryMinutes: getEnvNumber('MAGIC_LINK_EXPIRY_MINUTES', 10)
    },
    rateLimit: {
      enabled: getEnvBoolean('RATE_LIMIT_ENABLED', true),
      maxAttempts: getEnvNumber('RATE_LIMIT_MAX_ATTEMPTS', 5),
      windowSeconds: getEnvNumber('RATE_LIMIT_WINDOW', 3600)
    }
  },

  ui: {
    notifications: {
      durationMs: getEnvNumber('NOTIFICATION_DURATION_MS', 5000)
    },
    animations: {
      transitionDurationMs: getEnvNumber('ANIMATION_TRANSITION_DURATION_MS', 1000),
      preloadTimeMs: getEnvNumber('ANIMATION_PRELOAD_TIME_MS', 2000)
    }
  },

  urls: {
    wcm: getEnv('NEXT_PUBLIC_WCM_URL', 'https://weillcornell.org'),
    nyp: getEnv('NEXT_PUBLIC_NYP_URL', 'https://nyp.org'),
    patientPortal: getEnv('NEXT_PUBLIC_PATIENT_PORTAL_URL', 'https://myquest.org'),
    insuranceInfo: getEnv('NEXT_PUBLIC_INSURANCE_INFO_URL', 'https://www.weillcornell.org/patients'),
    microsoft: {
      teams: getEnv('NEXT_PUBLIC_TEAMS_URL', 'https://teams.microsoft.com'),
      outlook: getEnv('NEXT_PUBLIC_OUTLOOK_URL', 'https://outlook.office.com'),
      myApps: getEnv('NEXT_PUBLIC_MYAPPS_URL', 'https://myapps.microsoft.com')
    },
    social: {
      facebook: getEnv('NEXT_PUBLIC_FACEBOOK_URL', 'https://facebook.com/weillcornell'),
      twitter: getEnv('NEXT_PUBLIC_TWITTER_URL', 'https://twitter.com/WeillCornell'),
      linkedin: getEnv('NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/school/weill-cornell-medicine'),
      youtube: getEnv('NEXT_PUBLIC_YOUTUBE_URL', 'https://youtube.com/weillcornellmedicine')
    }
  },

  api: {
    timeout: getEnvNumber('API_TIMEOUT_MS', 30000),
    retryAttempts: getEnvNumber('API_RETRY_ATTEMPTS', 3),
    retryDelay: getEnvNumber('API_RETRY_DELAY_MS', 1000)
  },

  brainViewer: {
    scanDurations: getEnvArray('BRAIN_VIEWER_SCAN_DURATIONS', ['8000', '12000', '15000', '10000']).map(Number),
    imageUrls: {
      mni152: getEnv('BRAIN_VIEWER_MNI152_URL', 'https://niivue.github.io/niivue-demo-images/mni152.nii.gz'),
      chrisT1: getEnv('BRAIN_VIEWER_CHRIST1_URL', 'https://niivue.github.io/niivue-demo-images/chris_t1.nii.gz'),
      chrisT2: getEnv('BRAIN_VIEWER_CHRIST2_URL', 'https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz'),
      spm152: getEnv('BRAIN_VIEWER_SPM152_URL', 'https://niivue.github.io/niivue-demo-images/spm152.nii.gz')
    }
  },

  cors: {
    allowedOrigins: getEnvArray('CORS_ALLOWED_ORIGINS', [
      'http://localhost:3000',
      'https://wcinyp.netlify.app'
    ])
  },

  features: {
    enableAnalytics: getEnvBoolean('ENABLE_ANALYTICS', false),
    enableErrorReporting: getEnvBoolean('ENABLE_ERROR_REPORTING', false),
    maintenanceMode: getEnvBoolean('MAINTENANCE_MODE', false)
  }
}

// Validate required configuration at startup
export function validateConfig(): void {
  const errors: string[] = []

  // Add any required field validations here
  if (config.auth.sessionDuration.default < 1) {
    errors.push('SESSION_DURATION_DAYS must be at least 1')
  }

  if (config.auth.rateLimit.maxAttempts < 1) {
    errors.push('RATE_LIMIT_MAX_ATTEMPTS must be at least 1')
  }

  if (errors.length > 0) {
    throw new Error(`Configuration validation failed:\n${errors.join('\n')}`)
  }
}

// Export individual config sections for convenience
export const authConfig = config.auth
export const uiConfig = config.ui
export const urlConfig = config.urls
export const apiConfig = config.api
export const corsConfig = config.cors
export const featureFlags = config.features
export const loggingConfig = config.logging