'use strict';

const { hashPassword } = require('../helpers/bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // const dataUser = [
    //   {
    //     email: 'admin1@mail.co',
    //     password: hashPassword('12345'),
    //     role: 'admin',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     email: 'cust1@mail.co',
    //     password: hashPassword('12345'),
    //     role: 'customer',
    //     location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // const dataCategory = [
    //   {
    //     name: 'Laptop',
    //     interval: 3,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: 'Handphone',
    //     interval: 1,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: 'PC',
    //     interval: 7,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: 'Console',
    //     interval: 3,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     name: 'Peripherals',
    //     interval: 1,
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

    // const dataDevices = [
    //   {
    //     name: 'Asus ROG',
    //     description:
    //       'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
    //     imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVzh6Me38Shs2X_rjyoH19D6Wk8XTwa-BmQ&usqp=CAU',
    //     price: 100_000,
    //     specs: 'High-end',
    //     UserId: 2,
    //     CategoryId: 2,
    //     status: 'Available',
    //     location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ];

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
      {
        email: 'fano@mail.co',
        password: hashPassword('12345'),
        role: 'customer',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(106.824918 -6.136223)'),
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
        name: 'Asus ROG Phone 5',
        description: 'The ASUS ROG Phone 5 is probably the only gaming phone out there in the market that can offer you so many features and additional tools for those who seek optimal customization.',
        imgUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFVzh6Me38Shs2X_rjyoH19D6Wk8XTwa-BmQ&usqp=CAU',
        price: 100_000,
        specs: 'Mid-end',
        UserId: 2,
        CategoryId: 2,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Asus ROG M16',
        description: 'Fast, sleek, and ultraslim, the 2022 Zephyrus M16 delivers an exhilarating Windows 11 Pro experience. Everything from content creation to competitive play.',
        imgUrl: 'https://dlcdnwebimgs.asus.com/gain/676317DE-8D03-445A-AAC3-6BE6E558BF1E',
        price: 320_000,
        specs: 'High-end',
        UserId: 2,
        CategoryId: 1,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Alienware m17',
        description: 'Alienware M17 Gaming Notebook | 8th Gen Intel Core i7-8750H 6-Core | 17.3 Inch FHD 1920x1080 60Hz IPS | 16GB 2666MHz DDR4 RAM | 512GB SSD| NVIDIA GeForce RTX 2070 Max Q.',
        imgUrl: 'https://i0.wp.com/www.murdockcruz.com/wp-content/uploads/2022/07/Dell-Alienware-m17-R5-1.jpg?fit=740%2C562&ssl=1',
        price: 400_000,
        specs: 'High-end',
        UserId: 2,
        CategoryId: 1,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ROG Delta S Wireless',
        description: "The Delta S Wireless is one of the latest additions to Asus' ROG range of peripherals. It's packed full of features",
        imgUrl: 'https://dlcdnwebimgs.asus.com/files/media/6A881975-EAF7-4666-BD57-CE6D402C3EC2/v2/img/modes/rog-delta-s-wireless.png',
        price: 90_000,
        specs: 'High-end',
        UserId: 2,
        CategoryId: 5,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(107.5904275402039 -6.9439994342171225)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'MSI MPG Trident AS',
        description: 'The MPG Trident AS is the most fitting gaming desktops for your home. Coming in merely 10 liters in volume, they can easily fit in any corner of your home ',
        imgUrl: 'https://asset.msi.com/resize/image/global/product/product_1644556877ecee0545ef48c01c4f9c2899c2b7235a.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png',
        price: 210_00,
        specs: 'Mid-end',
        UserId: 3,
        CategoryId: 3,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(106.824918 -6.136223)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Playstation 5',
        description:
          'The latest Sony PlayStation introduced in November 2020. Powered by an eight-core AMD Zen 2 CPU and custom AMD Radeon GPU, the PS5 is offered in two models: with and without a 4K Blu-ray drive. Supporting a 120Hz video refresh, the PS5 is considerably more powerful than the PS4 and PS4 Pro.',
        imgUrl: 'https://images.versus.io/objects/sony-playstation-5-digital-edition.front.variety.1601030694282.jpg',
        price: 210_000,
        specs: 'Mid-end',
        UserId: 3,
        CategoryId: 3,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(106.824918 -6.136223)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Alienware Area 51',
        description: "The Area-51 is not only perfect for serious gamers, it's also the platform of choice for developers and programmers who demand concurring gaming workloads at the highest 4K resolution.",
        imgUrl: 'https://www.petunjuk.co.id/thumbs/products/l/779594-alienware-area51-r2.jpg',
        price: 520_000,
        specs: 'Mid-end',
        UserId: 3,
        CategoryId: 3,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(106.824918 -6.136223)'),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'ASUS TUF F15',
        description: 'TUF Gaming F15 is a feature-packed gaming laptop with the power to carry you to victory. The new GeForce RTX™ 3060 GPU delivers fluid gameplay',
        imgUrl: 'https://dlcdnwebimgs.asus.com/gain/f93bdd99-47d7-4f97-8800-5a83d0bd46a6/',
        price: 120_000,
        specs: 'Low-end',
        UserId: 3,
        CategoryId: 3,
        status: 'Available',
        location: Sequelize.fn('ST_GeomFromText', 'POINT(106.824918 -6.136223)'),
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
