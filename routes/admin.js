import express from 'express';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';
import { isAdmin, isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

// 모든 회원 정보 조회
router.get('/get-all-users', isAuthenticated, isAdmin, async (req, res) => {
  logger.info('router.admin.get-all-users');

  if (!req.session.id) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    logger.error('router.user.get-all-users.Error', error);
    res.status(500).json({ error: error.message });
  }
});

// 관리자 회원 삭제
router.delete(
  '/delete-user/:id',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    logger.info('router.admin.delete-user');

    if (!req.session.id) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    console.log('req.params', req.params.id);

    try {
      const params = {
        id: req.params.id,
      };
      const result = await userService.deleteUser(params);
      if (result === true) {
        res.status(200).json({ message: '회원 삭제 성공' });
      } else {
        res.status(400).json({ message: '삭제할 회원이 없습니다.' });
      }
    } catch (error) {
      logger.error('router.user.delete-user.Error', error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Role이 Admin인 사용자가 Role이 User인 사용자의 공장 소속을 변경해줌 최소 1곳에서 여러곳까지 부여 가능
// (Admin이 User의 공장 소속 변경)
router.put(
  '/update-user-factory/:id',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    logger.info('router.admin.update-user-factory');

    try {
      const params = {
        id: req.params.id, // id : 1
        factoryNames: req.body.factoryNames, // factoryNames : ['A-factory', 'B-factory']
      };
      const result = await userService.updateUserFactory(params);
      if (result === true) {
        res.status(200).json({ message: '공장 소속 변경 성공' });
      } else {
        res.status(400).json({ message: '공장 소속 변경 실패' });
      }
    } catch (error) {
      logger.error('router.user.update-user-factory.Error', error);
      res.status(500).json({ error: error.message });
    }
  }
);

//test
router.get('/get-all-factories', isAuthenticated, async (req, res) => {
  try {
    const result = await userService.getAllFactories();
    res.status(200).json(result);
  } catch (error) {
    logger.error('router.admin.get-all-factories.Error', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
