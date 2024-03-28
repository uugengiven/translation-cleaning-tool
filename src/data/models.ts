// models.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

export type BookForm = {
  id: number;
  title: string;
  author: string;
  description: string;
  info: string;
}

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public description!: string;
  public info!: string;
  public bookSections?: BookSection[];
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    info : {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Book',
  }
);

class BookSection extends Model {
  public id!: number;
  public bookId!: number;
  public sectionNumber!: number;
  public content!: string;
  public book?: Book;
  public FixedTranslations?: FixedTranslation[];
}

BookSection.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Books',
        key: 'id',
      },
    },
    sectionNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'BookSection',
  }
);

Book.hasMany(BookSection, { foreignKey: 'bookId' });
BookSection.belongsTo(Book, { foreignKey: 'bookId' });


class FixedTranslation extends Model {
  public id!: number;
  public bookSectionId!: number;
  public content!: string;
  public active!: boolean;
  public bookSection?: BookSection;
}

FixedTranslation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    bookSectionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'BookSections',
        key: 'id',
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: 'FixedTranslation',
  }
);

BookSection.hasMany(FixedTranslation, { foreignKey: 'bookSectionId' });
FixedTranslation.belongsTo(BookSection, { foreignKey: 'bookSectionId' });

export { Book, BookSection, FixedTranslation };