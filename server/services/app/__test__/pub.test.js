const request = require('supertest');
const app = require('../app');
const sequelize = require('../models');
// const { signToken, verifyToken } = require('../helpers/jwt');
const { signToken, verifyToken } = require('../helpers/jwt');
const { User, Device, Category, Transaction, Detail } = require('../models');

let validToken;

const user1 = {
  email: 'user1@mail.co',
  password: '12345',
  role: 'Seller',
};

const newCustomer = {
  email: 'newCustomer@mail.co',
  password: '12345',
  role: 'seller',
};

const newDevice = {
  name: 'MSI GAMING',
  description: 'Laptop pakai 2 bulan',
  imgUrl: 'https://static.bmdstatic.com/pk/product/large/61cd643e7e826.jpg',
  price: 250000,
  specs: 'Mid-End',
  CategoryId: 1,
};

const device = {
  name: 'Asus ROG',
  description:
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVzh6Me38Shs2X_rjyoH19D6Wk8XTwa-BmQ&usqp=CAU',
  price: 100000,
  // UserId: 1,
  CategoryId: 1,
  status: 'Available',
};

const category = {
  id: 1,
  name: 'Laptop',
  interval: 3,
};

beforeAll((done) => {
  // jest.restoreAllMocks();
  // Category.create(category)
  User.create(newCustomer)
    .then((registeredUser) => {
      validToken = signToken({
        id: registeredUser.id,
        email: registeredUser.email,
      });

      // return Category.create(category);
      return Transaction.create({ UserId: registeredUser.id });
    })
    .then(() => {
      return Category.create(category);
    })
    .then(() => {
      return Device.create(device);
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
      return Category.destroy({ truncate: true, cascade: true, restartIdentity: true });
    })
    .then((_) => {
      return Device.destroy({ truncate: true, cascade: true, restartIdentity: true });
    })
    .then((_) => {
      return Detail.destroy({ truncate: true, cascade: true, restartIdentity: true });
    })
    .then((_) => {
      return Transaction.destroy({ truncate: true, cascade: true, restartIdentity: true });
    })
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

  // mock
  describe('GET /pub/devices - fetch devices', () => {
    // beforeEach(() => {
    //   jest.restoreAllMocks();
    // });

    test('200 Success fetch - should return array of object', (done) => {
      request(app)
        .get('/pub/devices')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          return done();
        });
    });

    //mockkk
    // test('500 ISE', (done) => {
    //   jest.spyOn(Device, 'findAll').mockRejectedValue('Internal server error');
    //   request(app)
    //     .get('/pub/devices')
    //     .then((res) => {
    //       // expect your response here
    //       expect(res.status).toBe(500);
    //       // expect(res.body).toBe({ message: 'Internal server error' });
    //       // expect(typeof body).toBe('object');
    //       done();
    //     })
    //     .catch((err) => {
    //       done(err);
    //     });
    // });

    // test('500 ISE', (done) => {
    //   // jest.spyOn(Device, 'findAll').mockRejectedValue('Internal server error');
    //   Device.findAll = jest.fn().mockRejectedValue('Internal server error');
    //   console.log('===================================================');
    //   console.log('===================================================');
    //   console.log('===================================================');
    //   request(app)
    //     .get('/pub/devices')
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       const { body, status } = res;

    //       expect(status).toBe(500);
    //       // expect(Array.isArray(body)).toBeTruthy();
    //       return done();
    //     });
    // });
  });

  describe('GET /pub/devices/:id - fetch device by id', () => {
    test('200 Success fetch - should return an object', (done) => {
      request(app)
        .get('/pub/devices/1')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(typeof body).toBe('object');
          return done();
        });
    });
  });

  describe('GET /pub/categories - fetch categories', () => {
    test('200 Success fetch - should return array of object', (done) => {
      request(app)
        .get('/pub/categories')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(Array.isArray(body)).toBeTruthy();
          return done();
        });
    });
  });

  describe('GET /pub/categories/:id - fetch category by id', () => {
    test('200 Success fetch - should return an object', (done) => {
      request(app)
        .get('/pub/categories/1')
        .end((err, res) => {
          if (err) return done(err);
          const { body, status } = res;

          expect(status).toBe(200);
          expect(typeof body).toBe('object');
          return done();
        });
    });
  });

  describe('POST /pub/devices - post device', () => {
    test('201 Success post - should return an object', (done) => {
      request(app)
        .post('/pub/devices')
        .set('access_token', validToken)
        .send(newDevice)
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(201);
          expect(typeof body).toBe('object');
          expect(body).toHaveProperty('message', 'Success posted device');
          return done();
        });
    });
  });

  describe('POST /pub/rent/:deviceId - rent device', () => {
    test('201 Success rent - should return an object', (done) => {
      request(app)
        .post('/pub/rent/1')
        .set('access_token', validToken)
        .send({ rentEnd: 2 })
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(201);
          expect(typeof body).toBe('object');
          expect(body).toHaveProperty('message', 'Success add to transaction');
          return done();
        });
    });

    test('404 Failed rent - should return an error', (done) => {
      request(app)
        .post('/pub/rent/100')
        .set('access_token', validToken)
        .send({ rentEnd: 2 })
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(404);
          expect(typeof body).toBe('object');
          expect(body).toHaveProperty('message', 'Not found');
          return done();
        });
    });
  });

  describe('GET /pub/transactions - fetch transactions', () => {
    test('200 Success fetch - should return an object', (done) => {
      request(app)
        .get('/pub/transactions')
        .set('access_token', validToken)
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(200);
          expect(typeof body).toBe('object');
          return done();
        });
    });
  });

  describe('PATCH /pub/transactions - pay transactions', () => {
    test('200 Success fetch - should return an object', (done) => {
      request(app)
        .patch('/pub/transactions')
        .set('access_token', validToken)
        .end((err, res) => {
          if (err) return done(err);

          const { body, status } = res;

          expect(status).toBe(200);
          expect(typeof body).toBe('object');
          return done();
        });
    });
  });
});
