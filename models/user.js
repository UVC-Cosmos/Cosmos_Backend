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
        rank: {
          type: Sequelize.ENUM('사원', '대리', '과장', '부장'),
          allowNull: false,
          defaultValue: '사원',
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
    this.belongsToMany(models.Notification, {
      through: models.UserNotification,
      foreignKey: 'userId',
      otherKey: 'notificationId',
    });
    this.belongsToMany(models.Line, {
      through: models.UserLinePermission,
      foreignKey: 'userId',
    });
    this.hasMany(models.LoginLog, {
      foreignKey: 'userId',
    });
  }
}

export default User;
