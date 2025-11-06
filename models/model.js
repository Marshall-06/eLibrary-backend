const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: DataTypes.STRING, allowNull: false },
    phone_num: { type: DataTypes.INTEGER, allowNull: false },
    email: {type: DataTypes.STRING,allowNull: false},
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user"), defaultValue: "user" }
});

const Book = sequelize.define("Book", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {type: DataTypes.INTEGER,allowNull: false},
    name: { type: DataTypes.STRING, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false },
    pdf: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false }
});

const Highlight = sequelize.define("Highlight", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

const SavedQuote = sequelize.define("SavedQuote", {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  pageNumber: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});


const Category = sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: { type: DataTypes.STRING, allowNull: false }
});

const Audiobook = sequelize.define('Audiobook', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: {type: DataTypes.INTEGER,allowNull: false,},
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    audio: {type: DataTypes.STRING},
    author: { type: DataTypes.STRING, allowNull: false },
    categoryId: { type: DataTypes.INTEGER }
  }, {
    timestamps: true
  });
  

// **Define Associations**
Category.hasMany(Book, { foreignKey: "categoryId", as: "books" });
Book.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

Category.hasMany(Audiobook, { foreignKey: 'categoryId' });
Audiobook.belongsTo(Category, { foreignKey: 'categoryId' });

Highlight.belongsTo(User, { foreignKey: "userId" });
Highlight.belongsTo(Book, { foreignKey: "bookId" });

SavedQuote.belongsTo(User, { foreignKey: "userId" });
SavedQuote.belongsTo(Book, { foreignKey: "bookId" });

User.hasMany(Book, { foreignKey: "userId" });
Book.belongsTo(User, { foreignKey: "userId" });


User.hasMany(Audiobook, { foreignKey: "userId" });
Audiobook.belongsTo(User, { foreignKey: "userId" });

Audiobook.belongsTo(Category, { as: "category", foreignKey: "categoryId" });




module.exports = {
    User,
    Book,
    Category,
    Audiobook,
    Highlight,
    SavedQuote,
    sequelize
};

