import crypto from 'crypto';

export const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha256')
    .toString('hex');

  return { hash, salt };
};

export const verifyPassword = (params) => {
  const { checkedPassword, salt, hash } = params;

  const checkedPasswordHash = crypto
    .pbkdf2Sync(checkedPassword, salt, 1000, 64, 'sha256')
    .toString('hex');

  return checkedPasswordHash === hash;
};
