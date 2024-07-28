import express from 'express';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';
import sendSlackNotification from '../services/slackService.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
  logger.info('routes.user.POST');

  try {
    const params = {
      userId: req.body.userId,
      password: req.body.password,
      userName: req.body.userName,
      email: req.body.email,
    };
    const result = await userService.createUser(params);
    logger.info('routes.user.post.result', result);

    //슬랙 알림 발송
    const message = `새로운 회원이 가입했습니다. \n이름: ${params.userName}\n이메일: ${params.email}`;
    sendSlackNotification(message);

    res.status(200).json(result);
  } catch (err) {
    logger.error('ERROR: routes.user.POST', err);
    if (params.userId === undefined) {
      res.status(400).json({ error: '유효하지 않은 아이디 입니다.' });
    } else if (params.password === undefined) {
      res.status(400).json({ error: '유효하지 않은 비밀번호 입니다.' });
    } else if (params.userName === undefined) {
      res.status(400).json({ error: '유효하지 않은 이름 입니다.' });
    } else if (params.email === undefined) {
      res.status(400).json({ error: '유효하지 않은 이메일 입니다.' });
    }
    res.status(500).json(err);
  }
});

// 회원정보수정
router.put('/', async (req, res) => {
  logger.info('router.user.put');

  try {
    params = {
      userId: req.body.userId,
      password: req.body.password,
      userName: req.body.userName,
      email: req.body.email,
    };

    const result = await userService.updateUser(params);
    res.status(200).json(result);
  } catch (err) {
    logger.error('router.user.put.Error', err);
    res.status(500).json(err);
  }
});

router.get('/userinfo', async (req, res) => {
  logger.info('router.user.getUserInfo');

  if (!req.session.id) {
    return res.status(401).json({ message: '로그인이 필요합니다.' });
  }
  try {
    const params = {
      userId: req.user.id,
    };
    const result = await userService.getUserInfo(params);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    logger.error('router.user.getUserInfo.Error', error);
    res.status(500).json({ error: error.message });
  }
});

// 비밀번호 변경 엔드포인트
router.put('/existing-password-change', async (req, res) => {
  logger.info('router.user.existing-password-change');

  console.log('req.body', req.body);

  try {
    const params = {
      id: req.body.id,
      password: req.body.password,
    };
    const result = await userService.putUserPass(params);
    if (result === true) {
      res.status(200).json({ message: '비밀번호 변경 성공' });
    } else {
      res.status(400).json({ message: '비밀번호 변경 실패' });
    }
  } catch (error) {
    logger.error('router.user.existing-password-change.Error', error);
    res.status(400);
  }
});

export default router;
