import express, { NextFunction, Request, Response } from 'express';

import { logger } from '../../lib';
import { MovieService } from '../../services';
import {
  MovieIdValidator,
  MovieValidator,
  PaginationValidator,
  SearchValidator,
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
      const query = SearchValidator.parse(req.query);
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
      const { showId } = MovieIdValidator.parse(req.params);
      const [data] = await new MovieService().findById(showId);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },
);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requestId = res.getHeader('X-Request-Id');

    const movie = MovieValidator.parse(req.body);
    const [newMovie] = await new MovieService().add(movie);

    logger.info(
      { request: { id: requestId }, payload: { ...newMovie } },
      'Movie created',
    );

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

      const { showId } = MovieIdValidator.parse(req.params);
      const movie = MovieValidator.parse(req.body);
      await new MovieService().update({ showId, ...movie });

      logger.info({ request: { id: requestId } }, 'Movie updated');

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

      const { showId } = MovieIdValidator.parse(req.params);
      await new MovieService().remove(showId);

      logger.info({ request: { id: requestId } }, 'Movie deleted');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);
