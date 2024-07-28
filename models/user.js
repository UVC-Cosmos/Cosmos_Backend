import Sequelize from 'sequelize';

class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        password: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        userName: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        role: {
          type: Sequelize.ENUM(
            'Admin',
            'A-factoryAdmin',
            'B-factoryAdmin',
            'C-factoryAdmin',
            'User'
          ),
          defaultValue: 'User',
        },
      },
      {
        sequelize,
        underscored: true, // true: underscored, false: camelCase
        timestamps: true, // createAt, updatedAt
        paranoid: true, // deletedAt
      }
    );
  }
  static associate(models) {
    this.belongsToMany(models.Factory, {
      through: models.UserFactory,
      foreignKey: 'userId',
      otherKey: 'factoryId',
    });
    this.belongsToMany(models.Line, {
      through: models.UserLinePermission,
      foreignKey: 'userId',
    });
  }
}

export default User;
