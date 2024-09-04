import { Sequelize } from 'sequelize';

class Factory extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'Factory',
        tableName: 'factories', // 명시적으로 테이블 이름 설정
        underscored: true,
        timestamps: false,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsToMany(models.User, {
      through: models.UserFactory,
      foreignKey: 'factoryId',
      otherKey: 'userId',
    });
    this.hasMany(models.Line, { foreignKey: 'factoryId' });
    this.hasMany(models.Notification, { foreignKey: 'factoryId' });
  }
}

export default Factory;
