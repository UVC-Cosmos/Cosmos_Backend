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


}

export default userDao;