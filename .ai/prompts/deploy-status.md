# Deploy Status Command

Shows the current Netlify deployment status and recent deployments.

## Usage
```
[deploy-status]
[ds]  # shortcut
```

## What it does
1. Fetches latest deployment information from Netlify
2. Shows deployment state, branch, and timing
3. Provides links to preview and logs
4. Lists 5 most recent deployments

## Requirements
- Netlify CLI installed (`npm install`)
- NETLIFY_AUTH_TOKEN environment variable set
- Site must be linked with `netlify link`

## Example Output
```
📊 Latest Deployment Status

State: ✅ ready
Branch: main
Deploy ID: 65abc123
Created: 7/4/2025, 3:45:00 PM
Deploy Time: 45s

🔗 Preview: https://amazing-site-123.netlify.app
📋 Logs: https://app.netlify.com/sites/amazing-site/deploys/65abc123

📜 Recent Deployments:
1. ✅ ready - main - 7/4/2025, 3:45:00 PM
2. ❌ failed - fix-build - 7/4/2025, 3:30:00 PM
3. ✅ ready - main - 7/4/2025, 3:00:00 PM
```