import express from 'express';
import userService from '../services/userService.js';
import passport from '../config/passport.js';
import { isAuthenticated } from '../middlewares/index.js';
import { body, validationResult } from 'express-validator';
import logger from '../libs/logger.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  console.log('auth.login');

  // 이미 로그인된 사용자인지 확인
  if (req.isAuthenticated()) {
    return res.status(400).json({ message: '이미 로그인된 상태입니다.' });
  }
  logger.info('auth.login.SessionInit', req.session);

  passport.authenticate('local', (err, user) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!user) {
      return res.status(400).json({ message: err.message });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json(user);
    });
  })(req, res, next);
});

// 로그아웃
router.post('/logout', isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      res.clearCookie('mySessionName');
      return res.json({ message: 'Logout successful' });
    });
  });
});

// 이메일 인증
router.post('/verify-email', async (req, res) => {
  console.log(req.body.email);
  try {
    const params = {
      email: req.body.email,
    };
    if (params.email === '') {
      return res.status(400).json({ message: '이메일 주소를 입력해주세요.' });
    }
    const result = await userService.verificationEmail(params);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 이메일 인증 코드 인증
router.post('/verify-emailCode', async (req, res) => {
  try {
    const params = {
      email: req.body.email,
      code: req.body.code,
    };
    const result = await userService.verificationEmailCode(params);
    res.status(200).json(result);
  } catch (err) {
    logger.error('auth.verify-emailCode error: ' + err.message);
    res.status(400).json(err.message);
  }
});

// id 중복 체크
router.post('/idDuplicateCheck', async (req, res) => {
  try {
    const params = {
      userId: req.body.userId,
    };
    const result = await userService.duplicateCheck(params);
    res.status(200).json(result);
  } catch (err) {
    logger.error('auth.idDuplicateCheck.Error', err);
    if (params.userId === '') {
      res.status(400).json({ message: '아이디를 입력해주세요.' });
    }
    res.status(500).json(err);
  }
});

export default router;
