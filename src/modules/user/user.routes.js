import { handleGetAllUser } from './user.controller.js';

const userRoutes = async (server) => {
  server.get(
    '/',
    {
      preHandler: [server.authentication],
    },

    handleGetAllUser
  );
};

export default userRoutes;
