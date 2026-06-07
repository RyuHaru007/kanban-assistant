// @ts-nocheck
import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { mockConfluencePages } from '@/lib/mock-data';

export async function POST(req: Request) {
  const { messages, ticketContext } = await req.json();

  const systemPrompt = `You are a Senior AI Engineer agent assisting a developer in an Enterprise AI Hub context.
Your goal is to help them resolve their Jira tickets by analyzing context, drafting plans, and proposing pull requests.

CRITICAL INSTRUCTION: Since this is a prototype environment, you DO NOT have read access to the actual codebase. When asked to review code or implement a PR, you MUST intelligently hallucinate and mock the existing codebase files based on the Jira ticket context. Do NOT ask the user to provide the files.

Current Ticket Context:
${ticketContext}

You have access to the following tools:
1. getConfluenceContext: Use this to search for architectural guidelines, auth rules, or rate limiting docs.
2. executeSandboxBuild: Use this to run an ephemeral sandbox build. You MUST always call executeSandboxBuild to verify your code before calling proposePullRequest.
3. draftImplementationPlan: Use this to provide a step-by-step technical plan for the user's issue.
4. proposePullRequest: Use this when the user is ready to create a PR. YOU MUST populate the 'fileChanges' array with the 'fileName', 'originalCode', and 'newCode' so the UI can render a code diff. DO NOT use legacy fields like 'codeChanges'.`;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: modelMessages,
    system: systemPrompt,
    maxSteps: 5,
    // @ts-ignore - Bypass AI SDK strict typing for prototype
    tools: {
      executeSandboxBuild: tool({
        description: 'Run an ephemeral sandbox build to verify the codebase before proposing a PR. Simulates CI/CD test execution.',
        inputSchema: z.object({
          repo: z.string().describe('The GitHub repository name.'),
        }),
        execute: async ({ repo }: { repo: string }) => {
          await new Promise(resolve => setTimeout(resolve, 3000));
          return `Sandbox execution completed for ${repo}. Tests Passed: 14/14.`;
        },
      }),
      getConfluenceContext: tool({
        description: 'Search unstructured Confluence data for a specific topic (e.g., "Authentication", "Rate Limiting").',
        inputSchema: z.object({
          topic: z.string().describe('The topic to search for in Confluence.'),
        }),
        execute: async ({ topic }: { topic: string }) => {
          const lowerTopic = topic.toLowerCase();
          const match = mockConfluencePages.find(
            (page) => page.title.toLowerCase().includes(lowerTopic) || page.content.toLowerCase().includes(lowerTopic)
          );
          if (match) {
            return `Found Confluence Page: ${match.title}\n\nContent:\n${match.content}`;
          }
          return `No Confluence pages found for topic: ${topic}`;
        },
      }),
      draftImplementationPlan: tool({
        description: 'Draft a step-by-step text implementation plan for the issue.',
        inputSchema: z.object({
          issueId: z.string().describe('The Jira Issue ID.'),
          steps: z.array(z.string()).describe('The proposed steps.'),
        }),
        execute: async ({ issueId, steps }: { issueId: string; steps: string[] }) => {
          return `Implementation Plan for ${issueId}:\n${steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
        },
      }),
      proposePullRequest: tool({
        description: 'Proposes a Pull Request to a specific repository with code changes. This requires human approval.',
        inputSchema: z.object({
          repo: z.string().describe('The GitHub repository name (e.g., core-api-service).'),
          fileChanges: z.array(z.object({
            fileName: z.string().describe('The name of the file being changed.'),
            originalCode: z.string().describe('The original code snippet before changes.'),
            newCode: z.string().describe('The new code snippet after changes.'),
          })).describe('An array of files changed in this pull request.'),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
