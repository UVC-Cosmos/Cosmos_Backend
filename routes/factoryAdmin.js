import express from 'express';
import logger from '../libs/logger.js';
import { isAuthenticated, isFactoryAdmin } from '../middlewares/index.js';
import userService from '../services/userService.js';

const router = express.Router();

// 공장 별 사용자 조회
router.get(
  '/factory-users/:factoryId',
  isAuthenticated,
  isFactoryAdmin,
  async (req, res) => {
    try {
      const factoryId = req.params.factoryId;
      const users = await userService.getFactoryUsers(factoryId);
      res.status(200).json(users);
    } catch (error) {
      logger.error('factoryAdmin.getAllUsers.Error', error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
