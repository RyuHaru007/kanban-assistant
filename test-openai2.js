const { streamText, tool, jsonSchema } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
const openai = createOpenAI({
  apiKey: 'test',
  fetch: async (url, init) => {
    console.log(JSON.stringify(JSON.parse(init.body), null, 2));
    throw new Error("stop");
  }
});

async function main() {
  try {
    const result = streamText({
      model: openai('gpt-4o'),
      messages: [{ role: 'user', content: 'test' }],
      tools: {
        getConfluenceContext: tool({
          description: 'test',
          parameters: jsonSchema({ type: 'object', additionalProperties: false, properties: { topic: { type: 'string' } }, required: ['topic'] }),
        })
      }
    });
    for await (const chunk of result.textStream) {}
  } catch (e) {
    if (e.message !== "stop") console.error(e);
  }
}
main();
