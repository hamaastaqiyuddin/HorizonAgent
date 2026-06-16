#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import * as fs from 'fs';
import { initState, readState, saveState } from '../protocol/state';

const program = new Command();
const projectPath = process.cwd();

program
  .name('hz')
  .description('Horizon Handoff Protocol (HHP) - Cross-Agent CLI Handoff Tool')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize HHP in the current project directory')
  .action(() => {
    try {
      initState(projectPath);
      console.log('✨ Horizon Handoff Protocol (HHP) initialized successfully!');
      console.log('📂 Config and state are located in the .horizon/ directory.');
    } catch (error: any) {
      console.error('❌ Failed to initialize HHP:', error.message);
    }
  });

program
  .command('save')
  .description('Save current workspace state and create a handoff ticket')
  .argument('[message]', 'Optional commit/progress message')
  .option('-t, --title <title>', 'Set or update the active task title')
  .option('-d, --desc <description>', 'Set or update the active task description')
  .option('-r, --remaining <tasks>', 'Comma-separated list of remaining checklist tasks')
  .option('-a, --agent <agentName>', 'Set next agent assignee (e.g., claude, antigravity, human)', 'any')
  .option('-e, --errors <errors>', 'Provide compiler/lint errors to solve')
  .action((message, options) => {
    try {
      const currentState = readState(projectPath);
      
      const updatedTaskTitle = options.title || (message ? `Update: ${message}` : currentState.task.title);
      const updatedTaskDesc = options.desc || currentState.task.description;
      const remainingTasks = options.remaining 
        ? options.remaining.split(',').map((t: string) => t.trim()) 
        : currentState.task.remainingTasks;

      const saved = saveState(projectPath, {
        task: {
          title: updatedTaskTitle,
          description: updatedTaskDesc,
          status: 'in_progress',
          remainingTasks: remainingTasks
        },
        context: {
          ...currentState.context,
          compilerErrors: options.errors || ''
        },
        metadata: {
          lastAgent: 'human',
          nextAgent: options.agent,
          os: process.platform
        }
      });

      console.log('💾 Workspace state saved successfully!');
      console.log(`📂 Handoff ticket generated at: .horizon/handoff.md`);
      console.log(`🔗 Target handoff agent: ${saved.metadata.nextAgent}`);
    } catch (error: any) {
      console.error('❌ Failed to save workspace state:', error.message);
    }
  });

program
  .command('status')
  .description('Show the current handoff status and active task info')
  .action(() => {
    try {
      const statePath = path.join(projectPath, '.horizon', 'state.json');
      if (!fs.existsSync(statePath)) {
        console.log('⚠️ HHP is not initialized in this directory. Run `hz init` first.');
        return;
      }

      const state = readState(projectPath);
      console.log('\n========================================');
      console.log('🌅 HORIZON HANDOFF PROTOCOL (HHP) STATUS');
      console.log('========================================');
      console.log(`📅 Timestamp:   ${state.timestamp}`);
      console.log(`🌿 Git Branch:  ${state.context.gitBranch}`);
      console.log(`👤 Last Agent:  ${state.metadata.lastAgent}`);
      console.log(`🎯 Next Agent:  ${state.metadata.nextAgent}`);
      console.log('----------------------------------------');
      console.log(`📋 Task Title:  ${state.task.title}`);
      console.log(`📝 Description: ${state.task.description}`);
      console.log('----------------------------------------');
      console.log('📋 Remaining Checklist:');
      if (state.task.remainingTasks.length === 0) {
        console.log('  (Empty)');
      } else {
        state.task.remainingTasks.forEach(t => console.log(`  [ ] ${t}`));
      }
      console.log('----------------------------------------');
      console.log(`📂 Files Changed: ${state.context.filesModified.length}`);
      state.context.filesModified.forEach(f => console.log(`  * ${f}`));
      console.log('========================================\n');
    } catch (error: any) {
      console.error('❌ Failed to read status:', error.message);
    }
  });

program
  .command('load')
  .description('Print state JSON (for agent integration)')
  .action(() => {
    try {
      const state = readState(projectPath);
      console.log(JSON.stringify(state, null, 2));
    } catch (error: any) {
      console.error('❌ Failed to load state:', error.message);
    }
  });

program.parse(process.argv);
