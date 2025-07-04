#!/bin/bash

# Deploy migration script for moving Next.js to main directory

echo "🚀 Starting WCINYP Next.js migration deployment..."

# 1. Backup current React Router build
echo "📦 Backing up current build..."
cd /Users/tim/Documents/src-wcinyp
if [ -d "build-backup" ]; then
  rm -rf build-backup
fi
cp -r build build-backup

# 2. Clean all caches
echo "🧹 Clearing caches..."
rm -rf .cache
rm -rf node_modules/.cache
rm -rf build
rm -rf nextjs-migration/.next
rm -rf nextjs-migration/node_modules/.cache

# 3. Move Next.js files to main directory
echo "📂 Moving Next.js files to main directory..."
# Keep backup of important React Router files
cp package.json package-react-router.json.backup
cp netlify.toml netlify-react-router.toml.backup

# Copy Next.js files
cp -r nextjs-migration/* .
cp nextjs-migration/.* . 2>/dev/null || true

# 4. Clean up
echo "🧽 Cleaning up..."
rm -rf nextjs-migration

# 5. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 6. Build
echo "🔨 Building Next.js application..."
npm run build

# 7. Update Netlify config for Next.js
echo "⚙️ Updating Netlify configuration..."
cat > netlify.toml << 'EOF'
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NETLIFY_NEXT_PLUGIN_SKIP = "false"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  included_files = [".next/**"]
EOF

echo "✅ Migration deployment complete!"
echo "📝 Next steps:"
echo "   1. Commit all changes"
echo "   2. Push to your repository"
echo "   3. Netlify will automatically deploy with Next.js configuration"
echo "   4. Monitor the deployment for any issues"