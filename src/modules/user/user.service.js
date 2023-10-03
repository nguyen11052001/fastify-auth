import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma.js';

export const createUser = async (params) => {
  const { password, ...rest } = params;

  const hash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { ...rest, password: hash, token: '' },
  });

  return user;
};

export const findUserByUserName = async (userName) => {
  return await prisma.user.findUnique({
    where: {
      userName,
    },
  });
};

export async function getAllUser() {
  return prisma.user.findMany({
    select: {
      userName: true,
      name: true,
      id: true,
    },
  });
}

