# Supabase Authentication Setup Guide

This guide explains how to set up Supabase authentication for the WCINYP application.

## Prerequisites

1. Supabase account (free tier available at https://supabase.com)
2. Node.js 18+ installed
3. Access to your deployment platform (e.g., Netlify)

## Overview

The WCINYP application uses Supabase for:
- Magic link authentication (passwordless login)
- Session management
- User profile storage
- Row-level security (RLS) for data protection

## Configuration Steps

### 1. Create a Supabase Project

1. Sign up or log in at [supabase.com](https://supabase.com)
2. Click "New project"
3. Choose your organization
4. Set a strong database password
5. Select your region (choose closest to your users)

### 2. Environment Variables

You'll need three environment variables from your Supabase project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Find these in your Supabase dashboard under Settings > API.

### 3. Authentication Settings

In Supabase Dashboard > Authentication > Settings:

1. **Email Provider**: Enable email authentication
2. **Site URL**: Set to your production URL
3. **Redirect URLs**: Add allowed redirect URLs:
   - `http://localhost:3000/**` (development)
   - `https://your-domain.com/**` (production)

### 4. Email Restrictions

The application is configured to only accept `@med.cornell.edu` email addresses. This is enforced in the authentication code.

### 5. Database Setup

The application requires these tables:
- `profiles` - User profile information
- `pending_auth_sessions` - Cross-device authentication support
- `admin_configuration` - Admin email management

Run the migrations in the `supabase/migrations` folder in order.

## Security Features

- **Magic Links**: Passwordless authentication via email
- **Domain Restriction**: Only @med.cornell.edu emails allowed
- **Session Security**: HTTP-only cookies with strict same-site policy
- **Rate Limiting**: Protection against brute force attempts (requires Redis)
- **RLS Policies**: Database-level security rules

## Testing Your Setup

1. Start the development server: `npm run dev`
2. Navigate to the application
3. Enter a valid @med.cornell.edu email
4. Check your email for the magic link
5. Click the link to authenticate

## Troubleshooting

### Common Issues

**"Missing Supabase environment variables"**
- Ensure all three environment variables are set
- Restart your development server after adding them

**Not receiving magic link emails**
- Check spam folder
- Verify email settings in Supabase dashboard
- Ensure email domain is @med.cornell.edu

**Authentication not persisting**
- Check that cookies are enabled
- Verify Site URL matches your deployment
- Ensure redirect URLs are configured correctly

## Production Deployment

When deploying to production:

1. Add environment variables to your hosting platform
2. Update Site URL in Supabase to match production domain
3. Add production URLs to redirect allowlist
4. Run database migrations if not already applied
5. Test authentication flow thoroughly

## Support

For issues specific to:
- **Supabase**: Check their [documentation](https://supabase.com/docs)
- **Application**: Contact your system administrator
- **Authentication**: Verify you're using a valid @med.cornell.edu email