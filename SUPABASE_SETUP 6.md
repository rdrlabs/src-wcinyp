# Supabase Authentication Setup Guide

This guide explains how to complete the Supabase setup for the WCINYP application.

## Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new Supabase project

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy the following values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Configure Supabase Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure the following:
   - **Email Auth**: Enable "Email" provider
   - **Email Template**: Customize if needed
   - **Site URL**: Add your production URL (e.g., `https://your-app.netlify.app`)
   - **Redirect URLs**: Add:
     - `http://localhost:3000/**`
     - `https://your-app.netlify.app/**`

### 4. Create Database Schema (Optional)

If you want to store user profiles, run this SQL in the Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  net_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  last_login TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, net_id)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Deploy to Netlify

Add the environment variables to your Netlify deployment:

1. Go to Netlify Dashboard > Site Settings > Environment Variables
2. Add the same three environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 6. Test the Authentication

1. Run the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. You should be redirected to the login page
4. Enter a @med.cornell.edu email address
5. Check your email for the magic link
6. Click the link to authenticate

## Important Security Notes

- The authentication is configured to **only allow @med.cornell.edu email addresses**
- Magic links expire after 60 minutes
- Sessions are stored in secure HTTP-only cookies
- The service role key should NEVER be exposed to the client

## Troubleshooting

### "Missing Supabase environment variables" error
- Ensure all three environment variables are set in `.env.local`
- Restart the development server after adding environment variables

### Email not receiving magic link
- Check spam folder
- Verify email configuration in Supabase dashboard
- Ensure the email domain is @med.cornell.edu

### Authentication not persisting
- Check browser cookies are enabled
- Verify the site URL configuration in Supabase matches your deployment

## Features Implemented

- ✅ Email-based authentication (magic links)
- ✅ Domain restriction to @med.cornell.edu
- ✅ Session persistence
- ✅ Protected routes
- ✅ User menu in navbar
- ✅ Automatic token refresh
- ✅ Server-side authentication for API calls