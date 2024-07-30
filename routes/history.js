import express from 'express';
import logger from '../libs/logger.js';
import historyService from '../services/historyService.js';

const router = express.Router();

router.get('/:date', async (req, res) => {
  logger.info('router.history - ');
  console.log('🚀 ~ router.get ~ req.params.date:', req.params.date);

  // if (!req.session.id) {
  //   return res.status(401).json({ message: '로그인이 필요합니다.' });
  // }
  try {
    const params = {
      date: req.params.date,
    };
    const result = await historyService.getHistoryData(params);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    logger.error('router.history.getHistoryData.Error', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
