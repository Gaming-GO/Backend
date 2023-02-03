const request = require('supertest');
const app = require('../app');
const sequelize = require('../models');
// const { signToken, verifyToken } = require('../helpers/jwt');
const { User } = require('../models');

const user1 = {
  email: 'user1@mail.co',
  password: '12345',
  role: 'Seller',
};

afterAll((done) => {
  User.destroy({ truncate: true, cascade: true, restartIdentity: true })
    .then((_) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});

describe('Customer Routes Test', () => {
  describe('POST /pub/register - create new user', () => {
    test('201 Success register - should create new user', (done) => {
      request(app)
        .post('/pub/register')
        .send(user1)
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(201);
          expect(body).toHaveProperty('id', expect.any(Number));
          expect(body).toHaveProperty('role', expect.any(String));
          expect(body).toHaveProperty('email', user1.email);
          return done();
        });
    });

    test('400 Failed register - should return error if email is null', (done) => {
      request(app)
        .post('/pub/register')
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
        .post('/pub/register')
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
        .post('/pub/register')
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
        .post('/pub/register')
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
        .post('/pub/register')
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

  describe('POST /pub/login - user login', () => {
    test('200 Success login - should return access_token', (done) => {
      request(app)
        .post('/pub/login')
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
        .post('/pub/login')
        .send({
          email: 'user1@mail.co',
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
        .post('/pub/login')
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
        .post('/pub/login')
        .send({
          email: 'user1@mail.co',
          password: 'hehehe',
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
        .post('/pub/login')
        .send({
          email: 'user1@mail.co',
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
});
