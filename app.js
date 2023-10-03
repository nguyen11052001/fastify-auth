import cookie from '@fastify/cookie';
import Fastify from 'fastify';
import { verifyAuthentication } from './middleware/jwt.middleware.js';
import authRoutes from './src/modules/auth/auth.routes.js';
import { authSchemas } from './src/modules/auth/auth.schema.js';
import userRoutes from './src/modules/user/user.routes.js';

export const fastify = Fastify();

fastify.decorate('authentication', verifyAuthentication);

fastify.register(cookie, {
  // secret: 'my-secret', // for cookies signature
  hook: 'onRequest', // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest'
  parseOptions: {}, // options for parsing cookies
});

async function main() {
  for (const schema of authSchemas) {
    fastify.addSchema(schema);
  }

  fastify.register(userRoutes, { prefix: 'api/user' });
  fastify.register(authRoutes, { prefix: 'api/auth' });

  try {
    await fastify.listen({ port: 3000 }, (err) => {
      if (err) throw err;
      console.log(`server listening on ${fastify.server.address().port}`);
    });
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

main();
