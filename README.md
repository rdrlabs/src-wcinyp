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

- **React Router v7** - Modern React framework with SSR
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS v3.4** - Utility-first styling
- **TypeScript** - Type-safe development
- **Vitest & Playwright** - Unit and E2E testing
- **Netlify** - Deployment with edge functions

## AI Commands

This project includes AI-powered development commands. Type these in your AI assistant:

### Common Commands

- `[ship]` - Run tests, build, commit, and deploy
- `[test]` - Run test suite
- `[clean]` - Check for code issues
- `[help]` - List all commands

### Shortcuts

- `[s]` = `[ship]`
- `[t]` = `[test]` 
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
npm run start
```

## Deployment

### Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/rdrlabs/src-wcinyp)

The project is configured for automatic deployment to Netlify:

1. Fork this repository
2. Connect to Netlify
3. Deploy automatically on every push

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

The built app server is production-ready. Deploy the build output:

```
build/
├── client/    # Static assets
└── server/    # Server-side code
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
