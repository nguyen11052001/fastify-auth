import { verifyToken } from '../src/modules/auth/auth.service.js';

export const verifyAuthentication = async (request, reply, next) => {
  try {
    if (!request.headers.authorization) {
      return reply.code(401).send('No token was send');
    }
    const token = request.headers.authorization.replace('Bearer ', '');
    const user = await verifyToken(token);

    if (!user) {
      return reply.code(401).send('Authentication failed');
    }
    request.user = user;
    next();
  } catch (error) {
    return reply.code(401).send(error);
  }
};
