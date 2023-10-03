import jwt from 'jsonwebtoken';

export async function verifyToken(token) {
  try {
    const decoded = await jwt.verify(token, process.env.PRIVATE_KEY);
    return { ...decoded, token: token };
  } catch (error) {
    throw error;
  }
}

export const verifyExpiration = (exp) => {
  return exp < new Date().getTime();
};

export const generateAccessToken = async (data) => {
  return await jwt.sign(data, process.env.PRIVATE_KEY, {
    expiresIn: '60s',
  });
};

export const generateRefreshToken = async (data) => {
  return await jwt.sign(data, process.env.PRIVATE_REFRESH_KEY, {
    expiresIn: '10d',
  });
};
