import User from '../models/user.js';
import logger from '../libs/logger.js';

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
        where: { id: params.id }
      });
      return user;
    } catch (error) {
      console.log('userDao.userPasswordCheck.Error', error);
    }
  },

  async updateUserPassword(params) {
    console.log('userDao.updateUserPassword', params);

    try {
      const passwordUpdate = await User.update(params,{
        where: { id: params.id },
      })
      return passwordUpdate;
    } catch(error) {
      console.log('userDao.updateUserPassword.Error', error);
      throw error;
    }
  }
};

export default userDao;
