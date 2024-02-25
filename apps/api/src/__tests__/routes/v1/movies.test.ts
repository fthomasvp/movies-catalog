import request from 'supertest';

import { app } from '../../../app';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../../../utils';
import { mockedMovie } from '../../data';
import { invalidPaginationScenarios } from '../../utils';

describe('Routes - Movies v1', () => {
  let insertedId = '';

  describe('POST /', () => {
    it('should add a movie', async () => {
      const response = await request(app)
        .post('/api/v1/movies')
        .send(mockedMovie);

      insertedId = response.body.showId;

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('showId');
    });

    it('should NOT add a movie with title already in use', async () => {
      const response = await request(app)
        .post('/api/v1/movies')
        .send(mockedMovie);

      expect(response.status).toEqual(422);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'PostgresError');
    });

    it('should NOT add a movie with empty properties', async () => {
      const { title: _title, ...movie } = mockedMovie;

      const response = await request(app).post('/api/v1/movies').send(movie);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it.each([
      { property: 'type', value: 'Anime' },
      { property: 'rating', value: 'XYZ' },
    ])(
      'should NOT add a movie with invalid $property',
      async ({ property, value }) => {
        const response = await request(app)
          .post('/api/v1/movies')
          .send({ ...mockedMovie, [property]: value });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('GET /?offset=&limit=', () => {
    it('should return paginated movies', async () => {
      const response = await request(app).get('/api/v1/movies').query({
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: DEFAULT_PAGINATION_LIMIT,
      });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('offset');
      expect(response.body).toHaveProperty('total');
    });

    it.each(invalidPaginationScenarios)(
      'should NOT return paginated movies $reason',
      async ({ query }) => {
        const response = await request(app).get('/api/v1/movies').query(query);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('GET /:showId', () => {
    it('should return a movie by its show id', async () => {
      const response = await request(app).get(`/api/v1/movies/${insertedId}`);

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('showId');
    });

    it('should NOT return a movie with invalid show id', async () => {
      const response = await request(app).get('/api/v1/movies/someInvalidId');

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT return a movie with unregistered show id', async () => {
      const response = await request(app).get(
        '/api/v1/movies/i6bv1xwxjwgig9b9mhg13srs',
      );

      expect(response.status).toEqual(404);
    });
  });

  describe('GET /search?field=&value=&offset=&limit=', () => {
    // See https://jestjs.io/docs/api#testeachtablename-fn-timeout
    it.each([
      { field: 'title', value: 'Saltburn' },
      { field: 'director', value: 'Emerald Fennell' },
      { field: 'cast', value: 'Barry Keoghan' },
      { field: 'country', value: 'United States' },
    ])(
      'should return paginated movies filtered by $field',
      async ({ field, value }) => {
        const response = await request(app).get('/api/v1/movies/search').query({
          field,
          value,
          offset: DEFAULT_PAGINATION_OFFSET,
          limit: DEFAULT_PAGINATION_LIMIT,
        });

        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('items');
        expect(response.body).toHaveProperty('limit');
        expect(response.body).toHaveProperty('offset');
        expect(response.body).toHaveProperty('total');
      },
    );

    it.each([
      {
        field: 'releaseYear',
        value: 2023,
        reason: 'filtered by invalid field (releaseYear)',
      },
      { field: 'title', value: 'ab', reason: 'filtered by invalid value (ab)' },
      { field: undefined, value: 'Saltburn', reason: 'with empty field' },
      { field: 'title', value: undefined, reason: 'with empty value' },
    ])(
      'should NOT return paginated movies $reason',
      async ({ field, value }) => {
        const response = await request(app).get('/api/v1/movies/search').query({
          field,
          value,
          offset: DEFAULT_PAGINATION_OFFSET,
          limit: DEFAULT_PAGINATION_LIMIT,
        });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );

    it.each(invalidPaginationScenarios)(
      'should NOT return paginated movies $reason',
      async ({ query }) => {
        const response = await request(app)
          .get('/api/v1/movies/search')
          .query({ ...query, field: 'title', value: 'Saltburn' });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('PUT /', () => {
    it('should update a movie', async () => {
      const response = await request(app)
        .put(`/api/v1/movies/${insertedId}`)
        .send({ ...mockedMovie, title: `${mockedMovie.title} UPDATED` });

      expect(response.status).toEqual(204);
    });

    it('should NOT update a movie with empty properties', async () => {
      const { title: _title, ...movie } = mockedMovie;

      const response = await request(app)
        .put(`/api/v1/movies/${insertedId}`)
        .send(movie);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT update a movie with invalid id', async () => {
      const response = await request(app)
        .put('/api/v1/movies/someRandomId')
        .send({ ...mockedMovie, title: `${mockedMovie.title} UPDATED 2` });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it.each([
      { property: 'type', value: 'Anime' },
      { property: 'rating', value: 'XYZ' },
    ])(
      'should NOT update a movie with invalid $property',
      async ({ property, value }) => {
        const response = await request(app)
          .put(`/api/v1/movies/${insertedId}`)
          .send({ ...mockedMovie, [property]: value });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('DELETE /', () => {
    it('should remove a movie by id', async () => {
      const response = await request(app).delete(
        `/api/v1/movies/${insertedId}`,
      );

      expect(response.status).toEqual(204);
    });

    it.each([
      { showId: ':showId', reason: 'with empty id' },
      { showId: 'someRandomId', reason: 'with invalid id' },
    ])('should NOT remove a movie $reason', async ({ showId }) => {
      const response = await request(app).delete(`/api/v1/movies/${showId}`);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT remove an unregistered movie', async () => {
      const response = await request(app).delete(
        `/api/v1/movies/${insertedId}`,
      );

      expect(response.status).toEqual(404);
    });
  });
});
