import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

export const userCore = {
  userName: z.string({
    required_error: 'userName is required',
    invalid_type_error: 'userName must be a string',
  }),
  name: z.string(),
};

export const { schemas: userSchemas, $ref } = buildJsonSchemas({});
