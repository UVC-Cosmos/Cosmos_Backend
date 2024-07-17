import User from '../models/user.js';
import logger from '../libs/logger.js';

const userDao = {
  async insert(params) {
    logger.info('userDao insert:' + params);
    try {
      const inserted = await User.create(params);
      logger.info('Inserted user: ', inserted);
      return inserted;
    }catch(err){
      logger.error('Error! userDao insert error', err);
      throw err;
    }
  },
  async userLogin(params) {
    logger.info('userDao.userLogin', params);
    try {
      const selectedOne  = await User.findOne({
        where:{ userId: params.userId }
      });
      logger.info('userDao.userLogin.findOne', selectedOne );
      return selectedOne;
    } catch(err) {
      logger.error('userDao.userLogin.findOneError', err);
      throw err;
    }
  },
  async selectUser(params){
    logger.info('userDao.selectUser', params);
    try {
      const selectOne = await User.findOne({
        where: { userId: params.userId }
      });
      logger.info('userDao.selectUser.selectOne', selectOne);
      return selectOne;
    } catch(err) {
      logger.error('userDao.selectUser.selectOneError', err);
      throw err;
    }
  },

}

export default userDao;