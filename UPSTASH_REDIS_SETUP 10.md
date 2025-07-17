# 🚦 Upstash Redis Setup Guide for Rate Limiting

## Overview

This guide walks you through setting up Upstash Redis for the WCINYP authentication system's rate limiting feature. Rate limiting protects your application from brute force attacks by limiting login attempts to 5 per hour per IP address.

## What is Upstash Redis?

**Upstash** is a serverless Redis database service that's perfect for edge computing and serverless applications like those deployed on Netlify.

### Key Benefits:
- **Serverless**: No servers to manage
- **Pay-per-request**: Only pay for what you use (not idle time)
- **Free tier**: 10,000 requests per day at no cost
- **Global**: Low latency with edge locations worldwide
- **Simple**: Set up in minutes with just two environment variables

## Why We Use Upstash for Rate Limiting

In the WCINYP authentication system, Upstash Redis:
1. **Tracks login attempts** per IP address
2. **Enforces rate limits** (5 attempts per hour)
3. **Automatically expires** old attempt records
4. **Prevents brute force** password attacks
5. **Works seamlessly** with Netlify Functions

## Setup Instructions

### Step 1: Create an Upstash Account

1. Go to [console.upstash.com](https://console.upstash.com)
2. Click **"Sign Up"** (you can use GitHub, Google, or email)
3. Verify your email if needed

### Step 2: Create a Redis Database

1. Once logged in, click **"Create Database"**
2. Configure your database:
   - **Name**: `wcinyp-rate-limiting` (or any name you prefer)
   - **Type**: Regional (recommended for better performance)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Enable TLS**: Yes (keep enabled for security)
3. Click **"Create"**

### Step 3: Get Your Credentials

After creation, you'll see your database dashboard:

1. Find the **"REST API"** section
2. Copy these two values:
   - `UPSTASH_REDIS_REST_URL` → This is your `UPSTASH_REDIS_URL`
   - `UPSTASH_REDIS_REST_TOKEN` → This is your `UPSTASH_REDIS_TOKEN`

**Important**: Keep these credentials secret! They provide full access to your database.

### Step 4: Add to Netlify Environment Variables

1. Go to your Netlify dashboard
2. Select your WCINYP site
3. Navigate to **Site configuration** → **Environment variables**
4. Click **"Add a variable"** and add:

```bash
# Variable 1
Key: UPSTASH_REDIS_URL
Value: https://us1-xxxx-xxxx.upstash.io
Scopes: All (Production, Preview, Deploy Previews)

# Variable 2
Key: UPSTASH_REDIS_TOKEN
Value: AX4AAIjcDExxxxxxxxxxxxx
Scopes: All (Production, Preview, Deploy Previews)
```

5. Click **"Save"** for each variable

### Step 5: Redeploy Your Site

1. Trigger a new deployment in Netlify
2. The rate limiting will now be active!

## Testing Rate Limiting

### How to Test:

1. Go to your login page
2. Try logging in with an invalid email 6 times rapidly
3. On the 6th attempt, you should see: `"Too many login attempts. Please try again in 5 minutes."`

### Using Upstash Console:

1. In the Upstash console, click on **"Data Browser"**
2. You'll see keys like: `auth_rate_limit:123.456.789.0`
3. These track attempts per IP address

### Check the Logs:

In Netlify Functions logs, you'll see:
```
Rate limit check for IP: 123.456.789.0
Attempts: 3/5
```

## Configuration Options

The rate limiting is configured with these defaults:

```typescript
// In netlify/functions/rate-limiter.ts
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 attempts per 1 hour
  analytics: true, // Track usage statistics
  prefix: 'auth_rate_limit', // Key prefix in Redis
})
```

You can adjust these in the code if needed:
- Change `5` to allow more/fewer attempts
- Change `'1 h'` to `'30 m'` for 30-minute windows
- Change `'auth_rate_limit'` to use a different key prefix

## Monitoring Usage

### Free Tier Limits:
- **10,000 requests/day** (resets daily at midnight UTC)
- **256MB storage** (more than enough for rate limiting)
- **No credit card required**

### Check Your Usage:
1. Go to Upstash console
2. Click on your database
3. View the **"Usage"** tab
4. Monitor daily requests and storage

### Typical Usage:
- Each login attempt = 2-3 requests (check + increment + expire)
- 10,000 daily requests ≈ 3,000+ login attempts per day
- Most sites never exceed the free tier

## Cost Breakdown

### Free Tier (Most Sites):
- **$0/month** for up to 10,000 requests/day
- Perfect for small to medium applications

### Paid Usage:
- **$0.20 per 100,000 requests** after free tier
- Example: 50,000 requests/day = ~$2.40/month
- No minimum fees or idle charges

## Troubleshooting

### Rate Limiting Not Working?

1. **Check environment variables** in Netlify:
   ```bash
   UPSTASH_REDIS_URL=https://...upstash.io
   UPSTASH_REDIS_TOKEN=AX4AAI...
   ```

2. **Verify in logs** (Netlify Functions):
   ```
   Rate limiting is not configured. Skipping rate limit check.
   ```
   This means env vars are missing.

3. **Test connection** in Upstash console:
   - Go to "Data Browser"
   - Try setting a test key
   - If it works, Redis is connected

### Common Issues:

**"Connection refused" errors:**
- Check that TLS is enabled in Upstash
- Verify the URL includes `https://`
- Ensure token is complete (they're long!)

**"Rate limit not enforcing":**
- Clear your browser cookies
- Try from a different IP/device
- Check that attempts are incrementing in Upstash console

**"Undefined environment variables":**
- Redeploy after adding env vars
- Check variable names match exactly
- Ensure no extra spaces in values

## Fallback Behavior

If Upstash is not configured or unavailable:

```typescript
// From rate-limiter.ts
if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  console.warn('Rate limiting is not configured. Skipping rate limit check.')
  return {
    allowed: true,
    remaining: 5,
    reset: Date.now() + 3600000,
  }
}
```

**This means**: The app continues to work but without rate limiting protection.

## Advanced Configuration

### Custom Rate Limits by Email Domain:

```typescript
// Different limits for different users
const limit = email.endsWith('@admin.med.cornell.edu') ? 20 : 5
```

### IP Address Extraction:

The system uses these headers in order:
1. `x-forwarded-for` (Cloudflare/proxy)
2. `x-real-ip` (Nginx)
3. `client-ip` (Some proxies)
4. Falls back to 'unknown'

### Redis Key Structure:

```
auth_rate_limit:123.456.789.0
├── Value: 3 (attempt count)
├── TTL: 3542 seconds (time until reset)
└── Expires: Automatically after 1 hour
```

## Security Considerations

1. **Never commit credentials** to Git
2. **Use environment variables** only
3. **Enable TLS** in Upstash (default)
4. **Restrict token permissions** if possible
5. **Monitor for suspicious patterns** in usage

## Getting Help

### Resources:
- [Upstash Documentation](https://docs.upstash.com)
- [Upstash Discord](https://discord.gg/upstash)
- [Rate Limiting Best Practices](https://docs.upstash.com/redis/sdks/ratelimit-js)

### Support:
- Upstash Support: support@upstash.com
- Check Upstash status: [status.upstash.com](https://status.upstash.com)

---

## Quick Reference

### Environment Variables Needed:
```bash
UPSTASH_REDIS_URL=https://us1-xxxx-xxxx.upstash.io
UPSTASH_REDIS_TOKEN=AX4AAIjcDExxxxxxxxxxxxx
```

### Default Configuration:
- **Rate Limit**: 5 attempts per hour per IP
- **Key Prefix**: `auth_rate_limit:`
- **Expiration**: 1 hour sliding window
- **Free Tier**: 10,000 requests/day

### Testing Command:
```bash
# Check if rate limiting is active (in browser console)
for(let i = 0; i < 6; i++) {
  fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@med.cornell.edu' })
  }).then(r => console.log('Attempt', i+1, r.status))
}
# Should see 429 status on 6th attempt
```

---

*Last updated: December 2024*