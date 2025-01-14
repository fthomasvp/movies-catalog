import { NextFunction, Request, Response } from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';

import { InactiveUserError } from '../exceptions';
import { verifyRefreshToken } from '../libs';
import { UserService } from '../services';

export async function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { refreshToken } = req.cookies;

  try {
    if (!refreshToken) {
      throw new JsonWebTokenError('Invalid credentials');
    }

    const { isActive, sub } = verifyRefreshToken(refreshToken);

    const [user] = await new UserService().findBy({
      field: 'id',
      value: sub!,
    });

    if (!user) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      throw new ReferenceError();
    }

    if (user.isActive !== isActive) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      throw new InactiveUserError(
        'User is not allowed to perform any operations',
      );
    }

    next();
  } catch (error) {
    next(error);
  }
}
