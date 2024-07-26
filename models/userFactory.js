import { Sequelize } from 'sequelize';

class UserFactory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'User',
            key: 'id',
          },
        },
        factoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Factory',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'UserFactory',
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

export default UserFactory;
