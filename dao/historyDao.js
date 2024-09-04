// ./dao/historyDao.js

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
      const statistics = await getProductionStatistics();
      console.log('🚀 ~ selectData ~ statistics:', statistics);
      const defect = await getDefectRateStatistics();
      console.log('🚀 ~ selectData ~ defect:', defect);
      const dice = await getDiceStatistics();
      console.log('🚀 ~ selectData ~ dice:', dice);

      // 날짜별로 데이터 통합
      const result = Object.keys(statistics).map((date) => ({
        date,
        Statistics: statistics[date] || {},
        Defect: defect[date] || {},
        Dice: dice[date] || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
      }));

      logger.info('historyDao.selectData', result);
      return result; // 날짜별로 배열 반환
    } catch (err) {
      logger.error('historyDao.selectDataError', err);
      throw err;
    }
  },
};

export default historyDao;
