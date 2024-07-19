import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userDao from '../dao/userDao.js';
import hashUtil from '../libs/hashUtil.js';
import logger from '../libs/logger.js';

passport.use(
  new LocalStrategy(
    { usernameField: 'userId' },
    async (userId, password, done) => {
      const user = await userDao.userLogin({ userId: userId });
      if (!user) {
        logger.error('User not found');
        return done({ message: '존재하지 않는 유저입니다.' }, false);
      }
      const passwordCheck = await hashUtil.checkPasswordHash(
        password,
        user.password
      );
      if (!passwordCheck) {
        logger.error('Password check failed');
        return done({ message: '패스워드 불일치' }, false);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  console.log('Serializing user with ID:', user); // 로그 추가
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user with ID:', id); // 로그 추가
  try {
    const user = await userDao.selectUser({ userId: id });
    done(null, user);
  } catch (error) {
    console.log('passport deserialization error: ', error);
    done(error, null);
  }
});

export default passport;
