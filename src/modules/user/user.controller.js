import { getAllUser } from './user.service.js';

export const handleGetAllUser = async (request, reply) => {
  return await getAllUser();
};
