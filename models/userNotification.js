// userNotification.js
import { Sequelize } from 'sequelize';

class UserNotification extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // 참조하는 모델 이름
            key: 'id',
          },
        },
        notificationId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Notifications', // 참조하는 모델 이름
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'UserNotification',
        tableName: 'user_notifications',
        timestamps: true, // 타임스탬프가 필요하지 않다면 false로 설정
      }
    );
  }

  static associate(models) {
    // 외래 키 설정
    this.belongsTo(models.User, { foreignKey: 'userId' });
    this.belongsTo(models.Notification, { foreignKey: 'notificationId' });
  }
}

export default UserNotification;
