import {
  handleRefreshToken,
  handleSignIn,
  handleSignUp,
} from './auth.controller.js';
import { authRef } from './auth.schema.js';

const authRoutes = async (server) => {
  server.post(
    '/sign-up',
    {
      schema: {
        body: authRef('createUserSchema'),
        response: {
          200: authRef('createUserResponseSchema'),
        },
      },
    },
    handleSignUp
  );

  server.post(
    '/sign-in',
    {
      schema: {
        body: authRef('signInSchema'),
        response: {
          200: authRef('signInResponseSchema'),
        },
      },
    },
    handleSignIn
  );

  server.post(
    '/refresh-token',
    {
      schema: {
        body: authRef('refreshTokenRequestSchema'),
        response: {
          200: authRef('refreshTokenResponseSchema'),
        },
      },
    },
    handleRefreshToken
  );
};

export default authRoutes;
