import express, { NextFunction, Request, Response } from 'express';

import { encrypt, logger } from '../../libs';
import { verifyToken } from '../../middlewares';
import { UserService } from '../../services';
import {
  PaginationValidator,
  UserValidator,
  validateCUID2,
} from '../../validators';

export const router = express.Router();

router.get(
  '/',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = PaginationValidator.parse(req.query);
      const data = await new UserService().findAll(query);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader('X-Request-Id');

    const user = UserValidator.parse(req.body);
    user.password = encrypt(user.password);

    const [newUser] = await new UserService().add(user);

    logger.info({ requestId, payload: { ...newUser } }, 'User created');

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader('X-Request-Id');

      const id = validateCUID2(req.params.id);
      const user = UserValidator.omit({ email: true }).parse(req.body);
      const [updatedUser] = await new UserService().update({ id, ...user });

      if (!updatedUser?.id) {
        logger.warn({ requestId }, 'User not found');

        return res.status(404).send();
      }

      logger.info({ requestId }, 'User updated');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:id',
  verifyToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader('X-Request-Id');

      const id = validateCUID2(req.params.id);
      const [deletedUser] = await new UserService().remove(id);

      if (!deletedUser?.id) {
        logger.warn({ requestId }, 'User not found');

        return res.status(404).send();
      }

      logger.info({ requestId }, 'User deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
