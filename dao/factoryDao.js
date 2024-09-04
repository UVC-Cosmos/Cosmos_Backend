import Factory from '../models/factory.js';
import logger from '../libs/logger.js';

const factoryDao = {
  async getFactoriesByIds(params) {
    logger.info('factoryDao.getFactoriesByIds', params);
    try {
      const result = await Factory.findAll({
        where: { id: params.factoryIds },
        order: [['id', 'DESC']],
      });

      return result;
    } catch (error) {
      logger.error('factoryDao.getFactoriesByIds.Error', error);
      throw error;
    }
  },

  async getAllFactories() {
    try {
      const result = await Factory.findAll();
      return result;
    } catch (error) {
      logger.error('factoryDao.getAllFactories.Error', error);
      throw error;
    }
  },

  async getFactoryIdByName(params) {
    const factoryName = params.factoryNames.map((name) => name.trim());
    const factoryId = [];

    try {
      for (const name of factoryName) {
        const result = await Factory.findOne({
          where: { name },
        });
        if (result) {
          factoryId.push(result.id);
        }
      }
      return factoryId;
    } catch (error) {
      logger.error('factoryDao.getFactoryIdByName.Error', error);
      throw error;
    }
  },
};

export default factoryDao;
