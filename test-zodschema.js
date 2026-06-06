const { zodSchema } = require('@ai-sdk/provider-utils');
const { z } = require('zod');

const schema = zodSchema(z.object({ topic: z.string() }));
console.log(JSON.stringify(schema.jsonSchema));
