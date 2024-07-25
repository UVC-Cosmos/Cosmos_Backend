import express from 'express';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

// 모든 회원 정보 조회
router.get('/get-all-users', isAuthenticated, async (req, res) => {
  logger.info('router.user.get-all-users');

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
router.delete('/delete-user/:id', isAuthenticated, async (req, res) => {
  logger.info('router.user.delete-user');

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
});

export default router;
