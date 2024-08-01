import { Sequelize } from 'sequelize';

class LoginLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          allowNull: false,
        },
        timestamp: {
          type: Sequelize.DATE,
          defaultValue: Sequelize.NOW,
          allowNull: false,
        },
        action: {
          type: Sequelize.STRING,
          validate: {
            isIn: [['login', 'logout']],
          },
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'loginLogs',
        timestamps: false,
      }
    );
  }
  static associate(models) {
    LoginLog.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

export default LoginLog;
