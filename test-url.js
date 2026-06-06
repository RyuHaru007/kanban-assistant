const { generateObject } = require('ai');
const { z } = require('zod');
const { createOpenAI } = require('@ai-sdk/openai');
const openai = createOpenAI({
  apiKey: 'test',
  fetch: async (url, init) => {
    console.log(url);
    throw new Error("stop");
  }
});

async function main() {
  try {
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({ topic: z.string() }),
      prompt: 'test'
    });
  } catch (e) {
    if (e.message !== "stop") console.error(e);
  }
}
main();
