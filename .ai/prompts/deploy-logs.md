# Deploy Logs Command

Shows build logs from recent Netlify deployments.

## Usage
```
[deploy-logs]
[deploy-logs 10]  # show last 10 deployments
[dl]              # shortcut
```

## What it does
1. Fetches build logs from Netlify
2. Shows last 5 deployments by default
3. Displays build output and any errors
4. Helps troubleshoot deployment issues

## Requirements
- Netlify CLI installed
- NETLIFY_AUTH_TOKEN environment variable
- Site must be linked

## Example
```
[deploy-logs]
```

Shows the build logs from recent deployments to help diagnose build failures.