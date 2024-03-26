'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add onDelete: 'CASCADE' to the foreign key constraint in the BookSections table
      await queryInterface.removeConstraint('BookSections', 'BookSections_bookId_fkey', { transaction });
      await queryInterface.addConstraint('BookSections', {
        fields: ['bookId'],
        type: 'foreign key',
        name: 'BookSections_bookId_fkey',
        references: {
          table: 'Books',
          field: 'id',
        },
        onDelete: 'CASCADE',
        transaction,
      });

      // Add onDelete: 'CASCADE' to the foreign key constraint in the FixedTranslations table
      await queryInterface.removeConstraint('FixedTranslations', 'FixedTranslations_bookSectionId_fkey', { transaction });
      await queryInterface.addConstraint('FixedTranslations', {
        fields: ['bookSectionId'],
        type: 'foreign key',
        name: 'FixedTranslations_bookSectionId_fkey',
        references: {
          table: 'BookSections',
          field: 'id',
        },
        onDelete: 'CASCADE',
        transaction,
      });
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove the onDelete: 'CASCADE' option from the foreign key constraint in the FixedTranslations table
      await queryInterface.removeConstraint('FixedTranslations', 'FixedTranslations_bookSectionId_fkey', { transaction });
      await queryInterface.addConstraint('FixedTranslations', {
        fields: ['bookSectionId'],
        type: 'foreign key',
        name: 'FixedTranslations_bookSectionId_fkey',
        references: {
          table: 'BookSections',
          field: 'id',
        },
        transaction,
      });

      // Remove the onDelete: 'CASCADE' option from the foreign key constraint in the BookSections table
      await queryInterface.removeConstraint('BookSections', 'BookSections_bookId_fkey', { transaction });
      await queryInterface.addConstraint('BookSections', {
        fields: ['bookId'],
        type: 'foreign key',
        name: 'BookSections_bookId_fkey',
        references: {
          table: 'Books',
          field: 'id',
        },
        transaction,
      });
    });
  }
};
