import { Sequelize } from 'sequelize';

class UserLinePermission extends Sequelize.Model {
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
        lineId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Line',
            key: 'id',
          },
        },
        canControl: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'UserLinePermission',
        underscored: true,
        timestamps: true,
        paranoid: true,
      }
    );
  }
}

export default UserLinePermission;
