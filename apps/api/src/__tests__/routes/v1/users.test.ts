import request from 'supertest';

import { app } from '../../../app';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../../../utils';
import { mockedUser } from '../../data';
import { invalidPaginationScenarios, invalidUserScenarios } from '../../utils';

describe('Routes - Users v1', () => {
  let insertedId = '';

  describe('POST /', () => {
    it('should add an user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(mockedUser);

      insertedId = response.body.id;

      expect(response.status).toEqual(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should NOT add an user with email already in use', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send(mockedUser);

      expect(response.status).toEqual(422);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'PostgresError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT add an user with empty properties', async () => {
      const { email: _email, ...user } = mockedUser;

      const response = await request(app).post('/api/v1/users').send(user);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it.each(invalidUserScenarios)(
      'should NOT add an user with invalid $property',
      async ({ property, value }) => {
        const response = await request(app)
          .post('/api/v1/users')
          .send({ ...mockedUser, [property]: value });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('GET /?offset=&limit=', () => {
    it('should return paginated users', async () => {
      const response = await request(app).get('/api/v1/users').query({
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
      'should NOT return paginated users $reason',
      async ({ query }) => {
        const response = await request(app).get('/api/v1/users').query(query);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('PUT /', () => {
    it('should update an user', async () => {
      const response = await request(app)
        .put(`/api/v1/users/${insertedId}`)
        .send({ ...mockedUser, firstName: `${mockedUser.firstName} UPDATED` });

      expect(response.status).toEqual(204);
    });

    it('should NOT update an user with empty properties', async () => {
      const { firstName: _firstName, ...user } = mockedUser;

      const response = await request(app)
        .put(`/api/v1/users/${insertedId}`)
        .send(user);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT update an user with invalid id', async () => {
      const response = await request(app)
        .put('/api/v1/users/someRandomId')
        .send({
          ...mockedUser,
          firstName: `${mockedUser.firstName} UPDATED 2`,
        });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it.each(invalidUserScenarios.filter(s => s.property !== 'email'))(
      'should NOT update an user with invalid $property',
      async ({ property, value }) => {
        const response = await request(app)
          .put(`/api/v1/users/${insertedId}`)
          .send({ ...mockedUser, [property]: value });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body).toHaveProperty('error.type', 'ZodError');
        expect(response.body).toHaveProperty('error.message');
      },
    );
  });

  describe('DELETE /', () => {
    it('should remove an user by id', async () => {
      const response = await request(app).delete(`/api/v1/users/${insertedId}`);

      expect(response.status).toEqual(204);
    });

    it.each([
      { id: ':id', reason: 'with empty id' },
      { id: 'notValidCuid2Id', reason: 'with invalid id' },
    ])('should NOT remove an user $reason', async ({ id }) => {
      const response = await request(app).delete(`/api/v1/users/${id}`);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('error.type', 'ZodError');
      expect(response.body).toHaveProperty('error.message');
    });

    it('should NOT remove an unregistered user', async () => {
      const response = await request(app).delete(`/api/v1/users/${insertedId}`);

      expect(response.status).toEqual(404);
    });
  });
});
