// @ts-nocheck
import { openai } from '@ai-sdk/openai';
import { streamText, tool, convertToModelMessages } from 'ai';
import { z } from 'zod';
import { mockConfluencePages } from '@/lib/mock-data';

export async function POST(req: Request) {
  const { messages, ticketContext } = await req.json();

  const systemPrompt = `You are a Senior AI Engineer agent assisting a developer in an Enterprise AI Hub context.
Your goal is to help them resolve their Jira tickets by analyzing context, drafting plans, and proposing pull requests.
Current Ticket Context:
${ticketContext}

You have access to the following tools:
1. getConfluenceContext: Use this to search for architectural guidelines, auth rules, or rate limiting docs.
2. draftImplementationPlan: Use this to provide a step-by-step technical plan for the user's issue.
3. proposePullRequest: Use this when the user is ready to create a PR. This will pause and ask for the user's approval.`;

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openai('gpt-4o'),
    messages: modelMessages,
    system: systemPrompt,
    // @ts-ignore - Bypass AI SDK strict typing for prototype
    tools: {
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
          codeChanges: z.string().describe('A summary or patch of the code changes being proposed.'),
        }),
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
