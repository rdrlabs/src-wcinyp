#!/usr/bin/env node

/**
 * Fetch and display the latest Netlify deployment status
 * Requires NETLIFY_AUTH_TOKEN environment variable
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getDeploymentStatus() {
  try {
    // Get the site ID from netlify status
    const { stdout: siteInfo } = await execAsync('netlify status --json');
    const site = JSON.parse(siteInfo);
    
    if (!site || !site.id) {
      console.error('❌ No Netlify site linked. Run "netlify link" first.');
      process.exit(1);
    }

    // Get recent deploys
    const { stdout: deploysOutput } = await execAsync('netlify api listSiteDeploys --data \'{"site_id":"' + site.id + '"}\'');
    const deploys = JSON.parse(deploysOutput);
    
    if (!deploys || deploys.length === 0) {
      console.log('No deployments found.');
      return;
    }

    // Display latest deployment
    const latest = deploys[0];
    console.log('\n📊 Latest Deployment Status\n');
    console.log(`State: ${getStatusEmoji(latest.state)} ${latest.state}`);
    console.log(`Branch: ${latest.branch}`);
    console.log(`Deploy ID: ${latest.id}`);
    console.log(`Created: ${new Date(latest.created_at).toLocaleString()}`);
    
    if (latest.deploy_time) {
      console.log(`Deploy Time: ${latest.deploy_time}s`);
    }
    
    if (latest.error_message) {
      console.log(`\n❌ Error: ${latest.error_message}`);
    }
    
    if (latest.deploy_url) {
      console.log(`\n🔗 Preview: ${latest.deploy_url}`);
    }
    
    if (latest.logs_url) {
      console.log(`📋 Logs: ${latest.logs_url}`);
    }

    // Show recent deploys summary
    console.log('\n📜 Recent Deployments:');
    deploys.slice(0, 5).forEach((deploy, index) => {
      const time = new Date(deploy.created_at).toLocaleString();
      console.log(`${index + 1}. ${getStatusEmoji(deploy.state)} ${deploy.state} - ${deploy.branch} - ${time}`);
    });

  } catch (error) {
    if (error.message.includes('NETLIFY_AUTH_TOKEN')) {
      console.error('❌ Missing NETLIFY_AUTH_TOKEN environment variable');
      console.error('Get your token from: https://app.netlify.com/user/applications/personal');
      console.error('Then run: export NETLIFY_AUTH_TOKEN=your-token-here');
    } else if (error.message.includes('command not found')) {
      console.error('❌ Netlify CLI not installed. Run: npm install');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  }
}

function getStatusEmoji(state) {
  const emojis = {
    'ready': '✅',
    'building': '🔨',
    'error': '❌',
    'failed': '❌',
    'deploying': '🚀',
    'processing': '⚙️',
    'enqueued': '⏳',
    'retry': '🔄'
  };
  return emojis[state] || '❓';
}

// Run the script
getDeploymentStatus();