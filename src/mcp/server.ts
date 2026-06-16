import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readState, saveState } from '../protocol/state';

const server = new Server(
  {
    name: 'horizon-handoff-protocol',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'save_handoff',
        description: 'Save the current coding workspace state to create a handoff ticket for the next agent.',
        inputSchema: {
          type: 'object',
          properties: {
            task_title: { 
              type: 'string', 
              description: 'Brief title of the active task' 
            },
            task_description: { 
              type: 'string', 
              description: 'Detailed description of the active task' 
            },
            remaining_tasks: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of remaining checklist items for the next agent to complete'
            },
            variables: {
              type: 'object',
              description: 'Key-value pairs representing active memory state or variables to pass'
            },
            next_agent: {
              type: 'string',
              enum: ['claude', 'antigravity', 'human', 'any'],
              description: 'The target recipient agent for this handoff'
            },
            compiler_errors: {
              type: 'string',
              description: 'Optional compiler or linter errors that the next agent must solve'
            }
          },
          required: ['task_title', 'task_description', 'remaining_tasks']
        }
      },
      {
        name: 'load_handoff',
        description: 'Load the current handoff state (git info, checklist, variables) to resume work.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const projectPath = process.cwd();

  try {
    switch (name) {
      case 'save_handoff': {
        const { task_title, task_description, remaining_tasks, variables, next_agent, compiler_errors } = args as any;
        const saved = saveState(projectPath, {
          task: {
            title: task_title,
            description: task_description,
            status: 'in_progress',
            remainingTasks: remaining_tasks
          },
          context: {
            gitBranch: '',
            lastCommit: '',
            gitDiff: '',
            filesModified: [],
            compilerErrors: compiler_errors || ''
          },
          variables: variables || {},
          metadata: {
            lastAgent: 'agent',
            nextAgent: next_agent || 'any',
            os: process.platform
          }
        });
        return {
          content: [
            {
              type: 'text',
              text: `Handoff state saved successfully. State written to .horizon/state.json and markdown ticket created at .horizon/handoff.md.`
            }
          ]
        };
      }

      case 'load_handoff': {
        const state = readState(projectPath);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(state, null, 2)
            }
          ]
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Error: ${error.message}`
        }
      ]
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Horizon Handoff Protocol MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});
