#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the existing tasks
const tasksPath = path.join(__dirname, '../tasks/tasks.json');
const landingTasksPath = path.join(__dirname, '../tasks/landing-page-extraction-tasks.json');

try {
  // Read both files
  const existingTasks = JSON.parse(fs.readFileSync(tasksPath, 'utf8'));
  const landingTasks = JSON.parse(fs.readFileSync(landingTasksPath, 'utf8'));
  
  // Get the landing page tasks (20-31)
  const newTasks = landingTasks.master.tasks;
  
  // Add new tasks to existing tasks
  existingTasks.master.tasks.push(...newTasks);
  
  // Update metadata
  existingTasks.master.metadata.updated = new Date().toISOString();
  existingTasks.master.metadata.description = "Tasks for master context including landing page extraction";
  
  // Write back to tasks.json
  fs.writeFileSync(tasksPath, JSON.stringify(existingTasks, null, 2));
  
  console.log('✅ Successfully merged landing page tasks (20-31) into tasks.json');
  console.log(`📊 Total tasks: ${existingTasks.master.tasks.length}`);
  
  // Verify the merge
  const taskIds = existingTasks.master.tasks.map(t => t.id).sort((a, b) => a - b);
  console.log('📋 Task IDs:', taskIds.filter(id => id >= 15 && id <= 31).join(', '));
  
} catch (error) {
  console.error('❌ Error merging tasks:', error.message);
  process.exit(1);
}