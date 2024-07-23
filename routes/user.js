import express from 'express';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';
import sendSlackNotification from '../services/slackService.js';

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
    const params = {
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

export default router;
