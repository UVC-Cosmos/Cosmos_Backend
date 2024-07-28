import User from '../models/user.js';
import UserFactory from '../models/userFactory.js';
import logger from '../libs/logger.js';
import Factory from '../models/factory.js';

const userDao = {
  async insert(params) {
    console.log('userDao params: ', params);
    logger.info('userDao insert:' + params);
    try {
      const inserted = await User.create(params);
      logger.info('Inserted user: ', inserted);
      return inserted;
    } catch (err) {
      logger.error('Error! userDao insert error', err);
      throw err;
    }
  },

  async userLogin(params) {
    logger.info('userDao.userLogin', params);
    try {
      const selectedOne = await User.findOne({
        where: { userId: params.userId },
      });
      logger.info('userDao.userLogin.findOne', selectedOne);
      return selectedOne;
    } catch (err) {
      logger.error('userDao.userLogin.findOneError', err);
      throw err;
    }
  },

  async getAllUsers() {
    logger.info('userDao.getAllUsers');
    try {
      const selectAll = await User.findAll();
      return selectAll;
    } catch (error) {
      logger.error('userDao.getAllUsers.Error', error);
      throw error;
    }
  },

  async selectUser(params) {
    logger.info('userDao.selectUser', params);
    try {
      const selectOne = await User.findOne({
        where: { userId: params.userId },
      });
      logger.info('userDao.selectUser.selectOne', selectOne);
      return selectOne;
    } catch (err) {
      logger.error('userDao.selectUser.selectOneError', err);
      throw err;
    }
  },

  async selectUserByEmail(params) {
    logger.info('userDao.selectUserByEmail', params);
    try {
      const selectOne = await User.findOne({ where: { email: params.email } });
      logger.info('userDao.selectUserByEmail.selectOne', selectOne);
      return selectOne;
    } catch (err) {
      logger.error('userDao.selectUserByEmail.selectOneError', err);
      throw err;
    }
  },

  async update(params) {
    logger.info('userDao.update', params);
    try {
      const updated = await User.update(params, {
        where: { userId: params.userId },
      });
      logger.info('userDao.update.updated', updated);
      return updated;
    } catch (err) {
      logger.error('userDao.update.Error', err);
      throw err;
    }
  },

  async userInfo(params) {
    console.log(params);
    try {
      const user = await User.findOne({
        where: { userId: params.userId },
      });
      console.log(user);
      return user;
    } catch (error) {
      logger.error('userDao.userInfo.Error', error);
      throw error;
    }
  },

  async userPasswordCheck(params) {
    console.log('userDao', params);
    try {
      const user = await User.findOne({
        where: { id: params.id },
      });
      return user;
    } catch (error) {
      console.log('userDao.userPasswordCheck.Error', error);
    }
  },

  async updateUserPassword(params) {
    console.log('userDao.updateUserPassword', params);

    try {
      await User.update(params, {
        where: { id: params.id },
      });
      return true;
    } catch (error) {
      console.log('userDao.updateUserPassword.Error', error);
      throw error;
    }
  },

  async deleteUser(params) {
    try {
      const result = await User.destroy({
        where: { id: params.id },
      });
      if (result === 1) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error('userDao.deleteUser.Error', error);
      throw error;
    }
  },

  async removeUserFactories(params) {
    try {
      const result = await UserFactory.destroy({
        where: { userId: params.id },
      });
      return result;
    } catch (error) {
      logger.error('userDao.removeUserFactories.Error', error);
      throw error;
    }
  },

  async addUserFactories(params) {
    const userFactories = params.factoryIds.map((factoryId) => ({
      userId: params.id,
      factoryId,
    }));

    // [ { userId: 1, factoryId: 1 }, { userId: 1, factoryId: 2 } ]
    try {
      await UserFactory.bulkCreate(userFactories);
      console.log('Data inserted successfully.');
      return true;
    } catch (error) {
      console.error('Error during bulkCreate:', error);
      return false;
    }
  },

  async getUserById(params) {
    try {
      const user = await User.findOne({
        where: { id: params.id },
      });
      return user;
    } catch (error) {
      logger.error('userDao.getUserById.Error', error);
      throw error;
    }
  },

  async getFactoryUsers(factoryId) {
    console.log('userDao.getFactoryUsers', factoryId);
    return await User.findAll({
      include: [
        {
          model: Factory,
          where: { id: factoryId },
          through: {
            model: UserFactory,
            attributes: [],
          },
        },
      ],
    });
  },
};

export default userDao;
