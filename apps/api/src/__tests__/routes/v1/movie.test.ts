import request from 'supertest';

import { app } from '../../../app';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../../../utils';

// TODO: move mock data do another file
const mockedMovie = {
  type: 'Movie',
  title: 'Saltburn 123',
  director: 'Emerald Fennell',
  cast: 'Barry Keoghan, Jacob Elordi, Rosamund Pike, Richard E. Grant, Archie Madekwe',
  country: 'United States',
  dateAdded: 'December 22, 2023',
  releaseYear: '2023',
  rating: 'R',
  duration: '131 min',
  listedIn: 'Movies, Comedy, Drama, Thriller',
  description:
    "A student at Oxford University finds himself drawn into the world of a charming and aristocratic classmate, who invites him to his eccentric family's sprawling estate for a summer never to be forgotten.",
};
let insertedMovieId = '';

describe('Routes - Movies v1', () => {
  describe('GET /?offset=&limit=', () => {
    it('should return paginated movies', async () => {
      const response = await request(app)
        .get('/api/v1/movies')
        .query({
          offset: DEFAULT_PAGINATION_OFFSET,
          limit: DEFAULT_PAGINATION_LIMIT,
        });

      expect(response.status).toEqual(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('offset');
      expect(response.body).toHaveProperty('total');
    });

    it('should NOT return paginated movies with empty offset', async () => {
      const response = await request(app)
        .get('/api/v1/movies')
        .query({ limit: DEFAULT_PAGINATION_LIMIT });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT return paginated movies with empty limit', async () => {
      const response = await request(app)
        .get('/api/v1/movies')
        .query({ offset: DEFAULT_PAGINATION_OFFSET });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT return paginated movies with invalid offset', async () => {
      const response = await request(app)
        .get('/api/v1/movies')
        .query({ offset: -1, limit: DEFAULT_PAGINATION_LIMIT });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT return paginated movies with invalid limit', async () => {
      const response = await request(app)
        .get('/api/v1/movies')
        .query({ offset: DEFAULT_PAGINATION_OFFSET, limit: 301 });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
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
        const response = await request(app)
          .get('/api/v1/movies/search')
          .query({
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
        const response = await request(app)
          .get('/api/v1/movies/search')
          .query({
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

    it.each([
      {
        offset: undefined,
        limit: DEFAULT_PAGINATION_LIMIT,
        reason: 'with empty offset',
      },
      {
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: undefined,
        reason: 'with empty limit',
      },
      {
        offset: -1,
        limit: DEFAULT_PAGINATION_LIMIT,
        reason: 'with invalid offset [-1]',
      },
      {
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: 9,
        reason: 'with invalid limit [9]',
      },
      {
        offset: DEFAULT_PAGINATION_OFFSET,
        limit: 301,
        reason: 'with invalid limit [301]',
      },
    ])(
      'should NOT return paginated movies $reason',
      async ({ offset, limit }) => {
        const response = await request(app)
          .get('/api/v1/movies/search')
          .query({ field: 'title', value: 'Saltburn', offset, limit });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('POST /', () => {
    it('should add a movie', async () => {
      const response = await request(app)
        .post('/api/v1/movies')
        .send(mockedMovie);

      insertedMovieId = response.body.showId;

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('showId');
    });

    it('should NOT add a movie with the same title', async () => {
      const response = await request(app)
        .post('/api/v1/movies')
        .send(mockedMovie);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'PostgresError');
    });

    it('should NOT add a movie with empty properties', async () => {
      const { title: _title, ...restMovie } = mockedMovie;

      const response = await request(app)
        .post('/api/v1/movies')
        .send(restMovie);

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
          .post('/api/v1/movies/')
          .send({ ...mockedMovie, [property]: value });

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
        .put(`/api/v1/movies/${insertedMovieId}`)
        .send({ ...mockedMovie, title: `${mockedMovie.title} UPDATED` });

      expect(response.status).toEqual(204);
    });

    it('should NOT update a movie with empty properties', async () => {
      const { title: _title, ...restMovie } = mockedMovie;

      const response = await request(app)
        .put(`/api/v1/movies/${insertedMovieId}`)
        .send(restMovie);

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
          .put(`/api/v1/movies/${insertedMovieId}`)
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
        `/api/v1/movies/${insertedMovieId}`,
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
  });
});
