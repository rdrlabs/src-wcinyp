# Cross-Device Authentication Setup

This document explains how the cross-device authentication flow works in the WCI@NYP application, allowing users to request a magic link on one device (e.g., laptop) and open it on another device (e.g., phone) to authenticate the original device.

## How It Works

1. **User requests magic link on Device A (laptop)**
   - User enters email on login page
   - System creates a pending auth session with unique token
   - Magic link is sent with session token in URL
   - Device A starts polling for authentication status

2. **User opens magic link on Device B (phone)**
   - Link redirects to `/auth/callback?session=TOKEN`
   - System marks the session as authenticated
   - Success message shown on Device B

3. **Device A detects authentication**
   - Polling mechanism detects authenticated session
   - User is automatically signed in on Device A
   - Session token is cleaned up

## Database Setup

Run the migration to create the `pending_auth_sessions` table:

```sql
-- Run in Supabase SQL editor
-- File: supabase/migrations/001_create_pending_auth_sessions.sql
```

## Configuration

### 1. Update Supabase Auth Settings

In your Supabase dashboard:
1. Go to Authentication → URL Configuration
2. Add `/auth/callback` to the allowed redirect URLs
3. Ensure your site URL is correctly configured

### 2. Environment Variables

Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Security Features

1. **Session Expiration**: Sessions expire after 15 minutes
2. **Email Validation**: Only @med.cornell.edu emails allowed
3. **Device Fingerprinting**: Basic device identification for audit
4. **One-time Use**: Sessions can only be authenticated once
5. **Automatic Cleanup**: Expired sessions are cleaned up

## User Experience

### For Users:
1. Request login link on your laptop
2. Check email on any device (phone, tablet, etc.)
3. Click the magic link
4. You're automatically signed in on your laptop
5. Close the tab on your phone

### Visual Feedback:
- Loading spinner while waiting for authentication
- Success message on both devices
- Clear error messages if something goes wrong

## Troubleshooting

### Common Issues:

1. **"Session has expired" error**
   - Magic links expire after 15 minutes
   - Request a new link

2. **Not automatically signing in**
   - Ensure cookies are enabled
   - Check browser console for errors
   - Try refreshing the page

3. **"Unauthorized email domain" error**
   - Only @med.cornell.edu emails are allowed
   - Check for typos in email address

### Developer Notes:

- Polling interval: 2 seconds
- Session timeout: 15 minutes
- Cookie settings: `sameSite: 'strict'` for security
- All auth state changes are logged to console in development

## Testing

1. Open application in two different browsers
2. Request magic link in Browser A
3. Open email and click link in Browser B
4. Verify Browser A automatically signs in
5. Check that session is cleaned up in database

## Future Enhancements

- [ ] Add rate limiting for magic link requests
- [ ] Implement PKCE flow for additional security
- [ ] Add device trust management
- [ ] Support for QR code authentication
- [ ] Analytics for cross-device usage patterns