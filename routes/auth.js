import express from 'express';
import userService from '../services/userService.js';
import passport from '../config/passport.js';
import { isAuthenticated } from '../middlewares/index.js';
import { body, validationResult } from 'express-validator';
import logger from '../libs/logger.js';

const router = express.Router();

router.post('/login', (req, res, next) => {
  // 이미 로그인된 사용자인지 확인
  if (req.isAuthenticated()) {
    logger.info('Already logged in');
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
  console.log(req.body);
  try {
    const params = {
      email: req.body.email,
      code: req.body.code,
    };
    const result = await userService.verificationEmailCode(params);
    if (result === true) {
      res.status(200).json({ message: '이메일 인증 성공' });
    } else {
      res.status(400).json({ message: '이메일 인증 실패' });
    }
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

// 비밀번호 변경 시 기존 비밀번호 확인
router.post('/password-check', async (req, res) => {
  console.log('req.body', req.body);
  try {
    const params = {
      id: req.body.id,
      password: req.body.password,
    };
    const result = await userService.passwordCheck(params);
    if (result === true) {
      console.log('기존의 비밀번호가 일치함');
      res.status(200).json({ message: '기존의 비밀번호가 일치합니다.' });
    } else {
      res.status(400).json({ message: '기존의 비밀번호가 일치하지 않습니다' });
    }
  } catch (error) {
    logger.error('auth.password-check.Error', error);
    if (params.password === '') {
      res.status(400).json({ message: '비밀번호를 입력해주세요.' });
    } else if (params.id === '') {
      res.status(400).json({ message: '다시 로그인 후 시도해주세요' });
    }
    res.status(500).json(error);
  }
});

export default router;
