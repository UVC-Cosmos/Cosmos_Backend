// ./services/historyService.js

import historyDao from '../dao/historyDao.js';
import logger from '../libs/logger.js';

const historyService = {
  async getHistoryData(params) {
    try {
      const data = await historyDao.selectData(params);
      if (!data) {
        throw new Error('Data not found');
      }
      return data; // 날짜별로 정렬된 데이터 반환
    } catch (error) {
      logger.error('historyService.getHistoryData Error', error);
      throw error;
    }
  },
};

export default historyService;
