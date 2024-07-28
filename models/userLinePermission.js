import { Sequelize } from 'sequelize';
import { toDefaultValue } from 'sequelize/lib/utils';

class UserLinePermission extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        canControl: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'UserLinePermission',
        timestamps: true,
      }
    );
  }
}

export default UserLinePermission;
