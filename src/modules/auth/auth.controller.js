import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../utils/prisma.js';
import { createUser, findUserByUserName } from '../user/user.service.js';
import { generateAccessToken, generateRefreshToken } from './auth.service.js';

export const handleSignUp = async (request, reply) => {
  const body = request.body;
  try {
    const user = await findUserByUserName(body.userName);

    if (user) {
      return reply.code(400).send('Username already exists');
    }

    const newUser = await createUser(body);

    return reply.code(200).send(newUser);
  } catch (error) {
    return reply.code(500).send(error);
  }
};

export const handleSignIn = async (request, reply) => {
  const body = request.body;

  try {
    //find user by user name
    const user = await findUserByUserName(body.userName);

    if (!user) {
      return reply.code(401).send({
        message: 'Username not already exists or invalid',
      });
    }

    //verify password
    const isPasswordDone = await bcrypt.compare(body.password, user.password);

    if (isPasswordDone) {
      const { password, token, refreshToken, ...rest } = user;

      const _token = await generateAccessToken(rest);

      const _refreshToken = await generateRefreshToken(rest);
      await prisma.user.update({
        where: {
          id: user.id,
          userName: user.userName,
        },
        data: {
          ...user,
          token: _token,
          refreshToken: _refreshToken,
        },
      });

      return reply
        .setCookie('accessToken', _token)
        .setCookie('refreshToken', _refreshToken)
        .code(200)
        .send({
          accessToken: _token,
          refreshToken: _refreshToken,
        });
    }

    return reply.code(401).send({
      message: 'Invalid password',
    });
  } catch (error) {
    return reply.code(500).send(error);
  }
};

export const handleRefreshToken = async (request, reply) => {
  const { refreshToken } = request.body;

  if (!refreshToken) {
    return reply.code(403).send({
      message: 'Refresh token is required',
    });
  }

  try {
    //verify token
    const { id, exp } = await jwt.verify(
      refreshToken,
      process.env.PRIVATE_REFRESH_KEY
    );

    //find user by refresh token and id
    const user = await prisma.user.findUnique({
      where: {
        id,
        refreshToken,
      },
    });

    if (!user) {
      return reply.code(401).send({
        message: 'RefreshToken not already exists or invalid',
      });
    }

    const { password, token, refreshToken: _refreshToken, ...rest } = user;

    const _token = await generateAccessToken(rest);

    await prisma.user.update({
      where: {
        id: user.id,
        userName: user.userName,
      },
      data: {
        ...user,
        token: _token,
      },
    });

    return reply.setCookie('accessToken', _token).code(200).send({
      accessToken: _token,
    });
  } catch (error) {
    return reply.code(500).send(error);
  }
};
