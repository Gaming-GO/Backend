const request = require('supertest');
const app = require('../app');
const sequelize = require('../models');
const { signToken, verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

let validToken;
let invalidToken;

const user1 = {
  email: 'admin1@mail.co',
  password: '12345',
};

const newUser = {
  email: 'newUser@mail.co',
  password: '12345',
};

beforeAll((done) => {
  User.create(newUser)
    .then((registeredUser) => {
      validToken = signToken({
        id: registeredUser.id,
        email: registeredUser.email,
      });
      invalidToken = '12345678eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9';
    })
    .then(() => {
      // console.log({ validToken, invalidToken });
      done();
    })
    .catch((err) => {
      done(err);
    });
});

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe('Admin Routes Test', () => {
  describe('POST /admin/register - create new user', () => {
    test('201 Success register - should create new user', (done) => {
      request(app)
        .post('/admin/register')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('role', 'admin');
          expect(body).toHaveProperty('email', user1.email);
          return done();
        });
    });

    test('400 Failed register - should return error if email is null', (done) => {
      request(app)
        .post('/admin/register')
        .send({
          password: 'hehe',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'User.email cannot be null');
          return done();
        });
    });

    test('400 Failed register - should return error if email is already exist', (done) => {
      request(app)
        .post('/admin/register')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'email must be unique');
          return done();
        });
    });

    test('400 Failed register - should return error if password is null', (done) => {
      request(app)
        .post('/admin/register')
        .send({
          email: 'user2@mail.co',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'User.password cannot be null');
          return done();
        });
    });

    test('400 Failed register - should return error if email format is invalid', (done) => {
      request(app)
        .post('/admin/register')
        .send({
          email: 'user2',
          password: '12345',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Validation isEmail on email failed');
          return done();
        });
    });

    test('500 Failed register - should return error if type format is invalid', (done) => {
      request(app)
        .post('/admin/register')
        .send({
          email: 'user12@mail.co',
          password: 12345,
        })
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(500);
          expect(body).toHaveProperty('message', 'Internal server error');
          return done();
        });
    });
  });

  describe('POST /admin/login - admin login', () => {
    test('200 Success login - should return access_token', (done) => {
      request(app)
        .post('/admin/login')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(body).toHaveProperty('access_token', expect.any(String));
          return done();
        });
    });

    test('400 Failed login - should return error if password is null', (done) => {
      request(app)
        .post('/admin/login')
        .send({
          email: 'admin1@mail.co',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Password is required');
          return done();
        });
    });

    test('400 Failed login - should return error if email is null', (done) => {
      request(app)
        .post('/admin/login')
        .send({
          password: 'hehehe',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(400);
          expect(body).toHaveProperty('message', 'Email is required');
          return done();
        });
    });

    test('401 Failed login - should return error if email/password is invalid', (done) => {
      request(app)
        .post('/admin/login')
        .send({
          email: 'admin111@mail.co',
          password: '1234555',
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid email/password');
          return done();
        });
    });

    test('500 Failed login - should return error if type format is invalid', (done) => {
      request(app)
        .post('/admin/login')
        .send({
          email: 'admin1@mail.co',
          password: 12345,
        })
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(500);
          expect(body).toHaveProperty('message', 'Internal server error');
          return done();
        });
    });
  });

  describe('GET /admin/users - fetch users that is havent approved yet', () => {
    test('200 Success fetch - should return array of object', (done) => {
      request(app)
        .get('/admin/users')
        .set('access_token', validToken)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          return done();
        });
    });

    test('401 Failed fetch - should return error', (done) => {
      request(app)
        .get('/admin/users')
        .set('access_token', invalidToken)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;
          // console.log(body, '<=========================');

          expect(status).toBe(401);
          expect(body).toHaveProperty('message', 'Invalid token');
          return done();
        });
    });
  });

  describe('GET /admin/users/:id - fetch user by id', () => {
    test('200 Success fetch - should return object', (done) => {
      request(app)
        .get('/admin/users/1')
        .set('access_token', validToken)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          // expect(Array.isArray(body)).toBeTruthy();
          expect(typeof body).toBe('object');
          return done();
        });
    });

    test('404 Failed fetch - should return error', (done) => {
      request(app)
        .get('/admin/users/100')
        .set('access_token', validToken)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(404);
          // expect(Array.isArray(body)).toBeTruthy();
          expect(body).toHaveProperty('message', 'Not found');
          return done();
        });
    });
  });
});
