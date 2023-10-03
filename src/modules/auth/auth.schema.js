import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';
import { userCore } from '../user/user.schema.js';

const createUserSchema = z.object({
  ...userCore,
  password: z.string({
    required_error: 'password is required',
    invalid_type_error: 'password must be a string',
  }),
});

const createUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const signInSchema = z.object({
  userName: z.string({
    required_error: 'userName is required',
    invalid_type_error: 'userName must be a string',
  }),
  password: z.string(),
});

const signInResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

const refreshTokenRequestSchema = z.object({
  refreshToken: z.string(),
});

const refreshTokenResponseSchema = z.object({
  accessToken: z.string(),
});
export const { schemas: authSchemas, $ref: authRef } = buildJsonSchemas({
  createUserSchema,
  createUserResponseSchema,
  signInSchema,
  signInResponseSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema,
});
