import express from 'express';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

// 모든 회원 정보 조회
router.get('/get-all-users', isAuthenticated, async(req, res) => {
  logger.info('router.user.get-all-users');
  console.log('req.session', req.session.id);
  if(!req.session.id){
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try{
    const result = await userService.getAllUsers();
    res.status(200).json(result);
  } catch (error) {
    logger.error('router.user.get-all-users.Error', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;