import { Sequelize } from 'sequelize';

class Notification extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        content: {
          type: Sequelize.ENUM(
            '비상정지 발생',
            '비상정지 해제',
            '1호기 자재부족',
            '2호기 자재부족',
            '적재량 초과',
            '목표 생산량 달성',
            '1호기 불량품 기준 초과',
            '2호기 불량품 기준 초과',
            '권한 변경'
          ),
        },
      },
      {
        sequelize,
        modelName: 'Notification',
        tableName: 'Notifications', // 명시적으로 테이블 이름 설정
        underscored: true,
        timestamps: false,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.UserNotification,
      foreignKey: 'notificationId',
      otherKey: 'userId',
    });
    this.belongsTo(models.Factory, { foreignKey: 'factoryId' });
  }
}

export default Notification;
