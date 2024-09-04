// userFactory.js
import { Sequelize } from 'sequelize';

class UserFactory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Users', // 참조하는 모델 이름
            key: 'id',
          },
        },
        factoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Factories', // 참조하는 모델 이름
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'UserFactory',
        tableName: 'user_factories',
        timestamps: false, // 타임스탬프가 필요하지 않다면 false로 설정
      }
    );
  }
}

export default UserFactory;
