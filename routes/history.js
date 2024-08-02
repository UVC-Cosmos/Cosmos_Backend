import express from 'express';
import logger from '../libs/logger.js';
import historyService from '../services/historyService.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  logger.info('router.history - ');

  try {
    const params = {
      userId: req.user.id,
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
