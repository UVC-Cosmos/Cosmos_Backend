import { Sequelize } from 'sequelize';

class Line extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        name: {
          type: Sequelize.STRING(100),
        },
        factoryId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'factories',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        modelName: 'Line',
        tableName: 'lines',
        underscored: true,
        timestamps: false,
        paranoid: true,
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Factory, { foreignKey: 'factoryId' });
    this.belongsToMany(models.User, {
      through: models.UserLinePermission,
      foreignKey: 'lineId',
    });
  }
}

export default Line;
