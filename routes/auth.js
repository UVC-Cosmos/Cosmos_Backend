import express from 'express';
import s from '../services/userService.js';
import passport from '../config/passport.js';
import { isAuthenticated } from '../middlewares/index.js';
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

export default router;
