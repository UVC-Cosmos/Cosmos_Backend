import LoginLog from '../models/loginLog.js';
import logger from '../libs/logger.js';

const loginLogDao = {
  async createLoginLog(params) {
    try {
      const create = await LoginLog.create(params);
      logger.info('success create loginLog');
      return create;
    } catch (error) {
      logger.error('Error! loginLogDao createLoginLog error', error);
      throw error;
    }
  },
};

export default loginLogDao;
