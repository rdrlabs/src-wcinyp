# WCINYP Medical Admin Tool

Medical administrative application for Weill Cornell Imaging at NewYork-Presbyterian.

## 🚀 Live Demo

[https://wcinyp.netlify.app](https://wcinyp.netlify.app)

## Features

- 📄 **Document Hub** - Manage medical documents and forms
- 👥 **Provider Directory** - Search and manage medical staff
- 📝 **Form Builder** - Create dynamic medical forms  
- 📊 **Reports** - Analytics and insights dashboard

## Tech Stack

- **React Router v7** - Modern React framework (SPA mode)
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS v3.4** - Utility-first styling
- **TypeScript** - Type-safe development
- **Vitest & Playwright** - Unit and E2E testing
- **Netlify** - Static site hosting with global CDN

## AI Commands

This project includes AI-powered development commands. Type these in your AI assistant:

### Common Commands

- `[ship]` - Run tests, build, commit, and deploy
- `[test]` - Run test suite
- `[clean]` - Check for code issues
- `[deploy-status]` - Check Netlify deployment status
- `[deploy-logs]` - View recent deployment logs
- `[help]` - List all commands

### Shortcuts

- `[s]` = `[ship]`
- `[t]` = `[test]`
- `[ds]` = `[deploy-status]`
- `[dl]` = `[deploy-logs]`
- `[?]` = `[help]`

### Examples

```
[ship "fix: update button styles"]   # Deploy with message
[test unit --coverage]               # Run unit tests with coverage
[clean --fix]                        # Find and fix issues
[help ship]                          # Get help for ship command
```

Add `!` for fast mode: `[ship!]` skips confirmations.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rdrlabs/src-wcinyp.git
cd src-wcinyp

# Install dependencies
npm install
```

### Development

```bash
# Start dev server with HMR
npm run dev

# Run tests
npm run test

# Type checking
npm run typecheck
```

Your application will be available at `http://localhost:5173`.

## Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## Deployment

### Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rdrlabs/src-wcinyp)

The project is configured for automatic deployment to Netlify:

1. Fork this repository
2. Connect to Netlify
3. Deploy automatically on every push

#### Deployment Configuration

The app is configured as a Single Page Application (SPA) for optimal static hosting:

- **SPA Mode**: Client-side routing with instant navigation
- **Static Build**: Generates `index.html` and assets
- **CDN Delivery**: Served from Netlify's global edge network
- **Auto Redirects**: All routes serve `index.html` for client routing

#### Netlify CLI Integration

For deployment monitoring and management:

```bash
# Install dependencies (includes Netlify CLI)
npm install

# Link to your Netlify site
netlify link

# Set up authentication token (optional for monitoring)
export NETLIFY_AUTH_TOKEN=your-token-here
# Get token from: https://app.netlify.com/user/applications/personal

# Check deployment status
npm run deploy:status

# View deployment logs
npm run deploy:logs

# Open site in browser
npm run deploy:open
```

### Docker Deployment

```bash
# Build the image
docker build -t src-wcinyp .

# Run locally
docker run -p 3000:3000 src-wcinyp
```

Deploy to any container platform:
- AWS ECS / Fargate
- Google Cloud Run
- Azure Container Apps
- Fly.io
- Railway

### Manual Deployment

The app builds as a static SPA. Deploy the build output:

```
build/
└── client/        # Static assets
    ├── index.html # Entry point
    └── assets/    # JS, CSS, and other assets
```

## Project Structure

```
src-wcinyp/
├── app/
│   ├── routes/        # Page components
│   ├── components/    # Shared components
│   ├── lib/          # Utilities
│   └── root.tsx      # App shell
├── public/           # Static assets
├── .ai/              # AI assistant config
└── tests/            # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

---

Built with React Router v7 and shadcn/ui
