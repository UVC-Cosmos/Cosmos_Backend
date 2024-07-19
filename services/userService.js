import userDao from '../dao/userDao.js';
import logger from '../libs/logger.js';
import hashUtil from '../libs/hashUtil.js';

const userService = {
  async createUser(params) {
    logger.info('userService.createUser', params);

    let hashPassword = null;

    try{
      hashPassword = await hashUtil.makeHashPassword(params.password);
    }catch(err) {
      logger.error('userService.createUser.hashPassword', err);
      throw err;
    }

    const newParams = {
      ...params,
      password: hashPassword,
    };
    try {
      const insert = await userDao.insert(newParams);
      logger.info('userService.createUser.insert', insert);
      return insert;
    } catch(err) {
      logger.error('Error: userService.createUser.insert', err);
      throw err;
    }
  },
  async login(params){
    logger.info('userService.login', params);
    
    try {
    const user = await userDao.userLogin(params);

    if(!user) {
      const err = new Error('User not found');
      return err;
    }
    }catch(err) {
      logger.error('Error: userService.login.userLogin', err);
      throw err;
    }
  }
}

export default userService;