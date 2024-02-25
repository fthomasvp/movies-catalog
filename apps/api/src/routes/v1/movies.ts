import express, { NextFunction, Request, Response } from 'express';

import { logger } from '../../lib';
import { MovieService } from '../../services';
import {
  MovieSearchValidator,
  MovieValidator,
  PaginationValidator,
  validateCUID2,
} from '../../validators';

export const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = PaginationValidator.parse(req.query);
    const data = await new MovieService().findAll(query);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/search',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = MovieSearchValidator.parse(req.query);
      const data = await new MovieService().search(query);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  '/:showId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const showId = validateCUID2(req.params.showId);
      const [data] = await new MovieService().findById(showId);

      if (!data) {
        logger.warn({ showId }, 'Movie not found');

        return res.status(404).send();
      }

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader('X-Request-Id');
    const request = {
      id: requestId,
    };

    const movie = MovieValidator.parse(req.body);
    const [newMovie] = await new MovieService().add(movie);

    logger.info({ request, payload: { ...newMovie } }, 'Movie created');

    res.status(201).json(newMovie);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:showId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader('X-Request-Id');
      const request = {
        id: requestId,
      };

      const showId = validateCUID2(req.params.showId);
      const movie = MovieValidator.parse(req.body);
      const [updatedMovie] = await new MovieService().update({
        showId,
        ...movie,
      });

      if (!updatedMovie?.showId) {
        logger.warn({ request }, 'Movie not found');

        return res.status(404).send();
      }

      logger.info({ request }, 'Movie updated');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  '/:showId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const requestId = res.getHeader('X-Request-Id');
      const request = {
        id: requestId,
      };

      const showId = validateCUID2(req.params.showId);
      const [deletedMovie] = await new MovieService().remove(showId);

      if (!deletedMovie?.showId) {
        logger.warn({ request }, 'Movie not found');

        return res.status(404).send();
      }

      logger.info({ request }, 'Movie deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
