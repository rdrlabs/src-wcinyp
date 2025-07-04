# Deployment Instructions

## Option 1: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy to Netlify
netlify deploy --prod --dir=build/client
```

## Option 2: Deploy via GitHub + Netlify

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `src-wcinyp`
   - Description: "Medical administrative tool for Weill Cornell Imaging at NewYork-Presbyterian"
   - Make it public or private
   - Don't initialize with README (we already have one)

2. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/src-wcinyp.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose GitHub
   - Select your `src-wcinyp` repository
   - Build settings will auto-detect from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `build/client`
   - Click "Deploy site"

## Option 3: Direct Netlify Drop

1. Build the project:
   ```bash
   npm run build
   ```

2. Go to https://app.netlify.com/drop
3. Drag the `build/client` folder to the browser

## Environment Variables

If you need environment variables:
1. In Netlify dashboard → Site settings → Environment variables
2. Add any required variables
3. Redeploy to apply changes

## Custom Domain

1. In Netlify dashboard → Domain settings
2. Add custom domain
3. Follow DNS configuration instructions

## Continuous Deployment

With GitHub integration, every push to `main` will trigger a new deployment automatically.