'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dataUser = [
      {
        email: 'admin1@mail.co',
        password: hashPassword('12345'),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: 'cust1@mail.co',
        password: hashPassword('12345'),
        role: 'customer',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const dataCategory = [
      {
        name: 'Laptop',
        interval: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Handphone',
        interval: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'PC',
        interval: 7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Console',
        interval: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Peripherals',
        interval: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const dataDevices = [
      {
        name: 'Asus ROG',
        description:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVzh6Me38Shs2X_rjyoH19D6Wk8XTwa-BmQ&usqp=CAU',
        price: 100_000,
        specs: 'High-end',
        UserId: 2,
        CategoryId: 2,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert('Users', dataUser, {});
    await queryInterface.bulkInsert('Categories', dataCategory, {});
    await queryInterface.bulkInsert('Devices', dataDevices, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Devices', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
