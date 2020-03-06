import request from 'supertest';
import app from '../../src/app';
import { Model } from 'objection';
import Knex from 'knex';
import knexfileConfig from '../../src/knexfile-config';
import { assert } from 'joi';

const knex = Knex(knexfileConfig.test);
Model.knex(knex);

let accessToken = '';

beforeAll(async () => {
  await knex.seed.run();
});

afterAll(async (done) => {
  await knex.destroy();
  done();
});

describe('POST /api/auth/register', () => {
  describe('Register succeeded', () => {
    it('response should have the Set-Cookie header with the Authorization token', () => {
      const userData = {
        first_name: 'Test',
        last_name: 'Test',
        email: 'test1@gmail.com',
        password: '123456',
      };
      return request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect('Set-Cookie', /^ffs-app=.+/);
    });
  });

  describe('Register failure', () => {
    it('response should have the validation errors', () => {
      const userData = {
        first_name: '1',
        last_name: '2',
        email: 't.com',
        password: '123',
      };
      return request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);
    });
  });
});

describe('POST /api/auth/login', () => {
  describe('Login succeeded', () => {
    it('response should have the Set-Cookie header with the Authorization token', () => {
      const userData = {
        email: 'test@mail.com',
        password: '123456',
      };
      return request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect('Set-Cookie', /^ffs-app=.+/)
        .then((res) => {
          accessToken = res.body.access_token;
        });
    });
  });

  describe('Login failure', () => {
    it('response should have the unauthorized error', () => {
      const userData = {
        email: 'test123124dfsd@mail.com',
        password: '123',
      };
      return request(app)
        .post('/api/auth/login')
        .send(userData)
        .expect(401);
    });
  });
});

describe('GET /api/me', () => {
  describe('Get authorized user with access token', () => {
    it('response should have the user data', () => {
      return request(app)
        .get('/api/me')
        .set('Cookie', [`ffs-app=${accessToken}`])
        .expect(200)
        .then((res) => {
          assert(res.body.email, 'test@mail.com');
        });
    });
  });

  describe('Get authorized user without access token', () => {
    it('response should have unauthorized error', () => {
      return request(app)
        .get('/api/me')
        .expect(401);
    });
  });
});

describe('GET /api/logout', () => {
  describe('Logout succeeded', () => {
    it('response should clear authorization cookie', () => {
      return request(app)
        .get('/api/logout')
        .set('Cookie', [`ffs-app=${accessToken}`])
        .expect('Set-Cookie', /^ffs-app=;.+/);
    });
  });

  describe('Logout failure', () => {
    it('response should have unauthorized error', () => {
      return request(app)
        .get('/api/logout')
        .expect(401);
    });
  });
});
