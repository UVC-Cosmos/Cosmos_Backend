import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import userDao from '../dao/userDao.js';
import hashUtil from '../libs/hashUtil.js';
import logger from '../libs/logger.js';
import userService from '../services/userService.js';

passport.use(
  new LocalStrategy(
    { usernameField: 'userId' },
    async (userId, password, done) => {
      try {
        const user = await userService.login({ userId, password });
        return done(null, user);
      } catch (error) {
        logger.error('passport LocalStrategy Error', error);
        return done({ message: error.message }, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log('Serializing user with ID:', user.dataValues); // 로그 추가
  // logger.info('Serializing user with ID:', user); // 로그 추가
  done(null, user.userId);
});

passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user with ID:', id); // 로그 추가
  try {
    const user = await userService.logout({ userId: id });
    done(null, user);
  } catch (error) {
    console.log('passport deserialization error: ', error);
    done(error, null);
  }
});

export default passport;
