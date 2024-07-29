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

// 공장 별 사용자 제어 권한 변경
router.put('/user-line-control/:id', isAuthenticated, async (req, res) => {
  try {
    const params = {
      id: req.params.id, // 변경할 사용자 id
      userId: req.user.id, // 요청한 admin의 id => 어느 factory의 admin인지 확인하기 위함
      lines: req.body.lines, // line id 배열 [ "1호기", "2호기" ]
    };

    const result = await userService.updateUserLineControl(params);

    if (result === true) {
      res.status(200).json({ message: '변경 성공' });
    } else {
      res.status(400).json({ message: '변경 실패' });
    }
  } catch (error) {
    logger.error('factoryAdmin.userLineControl.Error', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
