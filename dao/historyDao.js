import logger from '../libs/logger.js';
import {
  getProductionStatistics,
  getDefectRateStatistics,
  getDiceStatistics,
} from '../libs/influxStatistics.js';

const historyDao = {
  async selectData(params) {
    logger.info('historyDao.selectData', params);
    try {
      let result = {
        Statistics: '',
        Defect: '',
        Dice: '',
      };
      result.Statistics = await getProductionStatistics(params.date);
      result.Defect = await getDefectRateStatistics(params.date);
      result.Dice = await getDiceStatistics(params.date);
      logger.info('historyDao.selectData', result);
      return result;
    } catch (err) {
      logger.error('historyDao.selectDataError', err);
      throw err;
    }
  },
};

export default historyDao;
