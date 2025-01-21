import { createHmac } from 'node:crypto';

export const encrypt = (pass: string) => {
  return createHmac('sha256', process.env.SECRET_SALT as string)
    .update(pass)
    .digest('hex');
};
