const { streamText, tool } = require('ai');
const { z } = require('zod');
const { createOpenAI } = require('@ai-sdk/openai');
const openai = createOpenAI({
  apiKey: 'test',
  fetch: async (url, init) => {
    console.log(JSON.stringify(JSON.parse(init.body).tools[0], null, 2));
    throw new Error("stop");
  }
});

async function main() {
  try {
    const result = streamText({
      model: openai('gpt-4-turbo'),
      messages: [{ role: 'user', content: 'test' }],
      tools: {
        getConfluenceContext: tool({
          description: 'test',
          parameters: z.object({ topic: z.string().describe('test description') }),
        })
      }
    });
    for await (const chunk of result.textStream) {}
  } catch (e) {
    if (e.message !== "stop") console.error(e);
  }
}
main();
