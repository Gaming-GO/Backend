'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DeviceId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Devices',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
        },
        onDelete: 'cascade',
        onUpdate: 'cascade',
      },
      price: {
        type: Sequelize.INTEGER,
      },
      rentDate: {
        type: Sequelize.DATE,
      },
      rentEnd: {
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Histories');
  },
};
