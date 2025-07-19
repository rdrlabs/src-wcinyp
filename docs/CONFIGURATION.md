# Configuration Guide

## Overview

The WCI@NYP application uses a centralized configuration system that loads values from environment variables with sensible defaults. All configuration is managed through the `/src/config/app.config.ts` file.

## Configuration Structure

### Core App Settings
- `NODE_ENV` - Application environment (development/staging/production)
- `NEXT_PUBLIC_APP_URL` - Public URL of the application

### Authentication Settings
```bash
# Session Duration
SESSION_DURATION_DAYS=7                    # Default session duration
SESSION_DURATION_REMEMBER_ME_DAYS=30       # Extended session for "remember me"
MAGIC_LINK_EXPIRY_MINUTES=10               # Magic link expiration time

# Rate Limiting
RATE_LIMIT_ENABLED=true                    # Enable/disable rate limiting
RATE_LIMIT_MAX_ATTEMPTS=5                  # Max attempts per window
RATE_LIMIT_WINDOW=3600                     # Window duration in seconds
```

### UI Settings
```bash
# Notifications
NOTIFICATION_DURATION_MS=5000              # Default notification display time

# Animations
ANIMATION_TRANSITION_DURATION_MS=1000      # Transition animation duration
ANIMATION_PRELOAD_TIME_MS=2000             # Preload time for animations
```

### External URLs
```bash
# Partner Sites
NEXT_PUBLIC_WCM_URL=https://weillcornell.org
NEXT_PUBLIC_NYP_URL=https://nyp.org

# Patient Resources
NEXT_PUBLIC_PATIENT_PORTAL_URL=https://myquest.org
NEXT_PUBLIC_INSURANCE_INFO_URL=https://www.weillcornell.org/patients

# Microsoft Services
NEXT_PUBLIC_TEAMS_URL=https://teams.microsoft.com
NEXT_PUBLIC_OUTLOOK_URL=https://outlook.office.com
NEXT_PUBLIC_MYAPPS_URL=https://myapps.microsoft.com

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/weillcornell
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/WeillCornell
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/school/weill-cornell-medicine
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/weillcornellmedicine
```

### API Settings
```bash
API_TIMEOUT_MS=30000                       # Request timeout
API_RETRY_ATTEMPTS=3                       # Number of retry attempts
API_RETRY_DELAY_MS=1000                    # Delay between retries
```

### Brain Viewer Settings
```bash
# Scan durations (comma-separated milliseconds)
BRAIN_VIEWER_SCAN_DURATIONS=8000,12000,15000,10000

# Image URLs
BRAIN_VIEWER_MNI152_URL=https://niivue.github.io/niivue-demo-images/mni152.nii.gz
BRAIN_VIEWER_CHRIST1_URL=https://niivue.github.io/niivue-demo-images/chris_t1.nii.gz
BRAIN_VIEWER_CHRIST2_URL=https://niivue.github.io/niivue-demo-images/chris_t2.nii.gz
BRAIN_VIEWER_SPM152_URL=https://niivue.github.io/niivue-demo-images/spm152.nii.gz
```

### CORS Settings
```bash
# Comma-separated list of allowed origins
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://wcinyp.netlify.app
```

### Feature Flags
```bash
ENABLE_ANALYTICS=false                     # Enable analytics tracking
ENABLE_ERROR_REPORTING=false               # Enable error reporting
MAINTENANCE_MODE=false                     # Enable maintenance mode
```

## Usage in Code

### Importing Configuration

```typescript
// Import the entire config
import { config } from '@/config/app.config'

// Import specific sections
import { authConfig, uiConfig, urlConfig } from '@/config/app.config'

// Usage examples
const sessionDuration = authConfig.sessionDuration.default
const notificationDuration = uiConfig.notifications.durationMs
const wcmUrl = urlConfig.wcm
```

### Accessing Configuration Values

```typescript
// Authentication
const maxAttempts = config.auth.rateLimit.maxAttempts
const magicLinkExpiry = config.auth.magicLink.expiryMinutes

// UI
const transitionDuration = config.ui.animations.transitionDurationMs

// URLs
const teamsUrl = config.urls.microsoft.teams

// Feature Flags
if (config.features.enableAnalytics) {
  // Initialize analytics
}
```

## Environment-Specific Configuration

### Development
```bash
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENABLE_ERROR_REPORTING=true
```

### Staging
```bash
NODE_ENV=staging
NEXT_PUBLIC_APP_URL=https://staging.wcinyp.netlify.app
ENABLE_ANALYTICS=true
```

### Production
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://wcinyp.netlify.app
ENABLE_ANALYTICS=true
ENABLE_ERROR_REPORTING=true
```

## Configuration Validation

The application validates configuration on startup. If required values are missing or invalid, it will throw an error with details:

```typescript
// This runs automatically on app start
validateConfig()
```

## Adding New Configuration

1. Add the environment variable to `.env.example`
2. Update the `AppConfig` interface in `app.config.ts`
3. Add the getter logic in the config object
4. Update this documentation
5. Add any validation rules to `validateConfig()`

Example:
```typescript
// 1. Update interface
interface AppConfig {
  newFeature: {
    enabled: boolean
    apiKey: string
  }
}

// 2. Add to config object
newFeature: {
  enabled: getEnvBoolean('NEW_FEATURE_ENABLED', false),
  apiKey: getEnv('NEW_FEATURE_API_KEY', '')
}

// 3. Add validation if required
if (config.newFeature.enabled && !config.newFeature.apiKey) {
  errors.push('NEW_FEATURE_API_KEY is required when NEW_FEATURE_ENABLED is true')
}
```

## Best Practices

1. **Use NEXT_PUBLIC_ prefix** for client-side environment variables
2. **Provide sensible defaults** for all non-critical configuration
3. **Validate required configuration** on startup
4. **Group related configuration** in the interface structure
5. **Document all configuration** in this file and `.env.example`
6. **Use type-safe access** through the config object
7. **Avoid direct process.env access** in application code

## Security Considerations

1. Never commit `.env` files to version control
2. Use different values for development/staging/production
3. Rotate sensitive values regularly
4. Use secret management services for production
5. Validate and sanitize all configuration values
6. Keep sensitive configuration server-side only (no NEXT_PUBLIC_ prefix)