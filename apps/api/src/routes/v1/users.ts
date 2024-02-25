import express, { NextFunction, Request, Response } from 'express';

import { logger } from '../../lib';
import { UserService } from '../../services';
import {
  PaginationValidator,
  UserValidator,
  validateCUID2,
} from '../../validators';

export const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = PaginationValidator.parse(req.query);
    const data = await new UserService().findAll(query);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader('X-Request-Id');
    const request = {
      id: requestId,
    };

    const user = UserValidator.parse(req.body);
    const [newUser] = await new UserService().add(user);

    logger.info({ request, payload: { ...newUser } }, 'User created');

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader('X-Request-Id');
    const request = {
      id: requestId,
    };

    const id = validateCUID2(req.params.id);
    const user = UserValidator.omit({ email: true }).parse(req.body);
    const [updatedUser] = await new UserService().update({ id, ...user });

    if (!updatedUser?.id) {
      logger.warn({ request }, 'User not found');

      return res.status(404).send();
    }

    logger.info({ request }, 'User updated');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

router.delete(
  '/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader('X-Request-Id');
      const request = {
        id: requestId,
      };

      const id = validateCUID2(req.params.id);
      const [deletedUser] = await new UserService().remove(id);

      if (!deletedUser?.id) {
        logger.warn({ request }, 'User not found');

        return res.status(404).send();
      }

      logger.info({ request }, 'User deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
