import userDao from '../dao/userDao.js';
import logger from '../libs/logger.js';
import hashUtil from '../libs/hashUtil.js';
import sendVerificationEmail from '../services/emailService.js';
import { setVerifyToken, checkVerifyToken } from '../config/redis.js';
import crypto from 'crypto';

const userService = {
  async createUser(params) {
    logger.info('userService.createUser', params);

    let hashPassword = null;

    try {
      hashPassword = await hashUtil.makeHashPassword(params.password);
    } catch (err) {
      logger.error('userService.createUser.hashPassword', err);
      throw err;
    }

    const newParams = {
      ...params,
      password: hashPassword,
    };
    try {
      const insert = await userDao.insert(newParams);
      logger.info('userService.createUser.insert', insert);
      return insert;
    } catch (err) {
      logger.error('Error: userService.createUser.insert', err);
      throw err;
    }
  },

  async login(params) {
    logger.info('userService.login', params);

    try {
      const user = await userDao.userLogin(params);

      if (!user) {
        const err = new Error('User not found');
        return err;
      }
    } catch (err) {
      logger.error('Error: userService.login.userLogin', err);
      throw err;
    }
  },

  async verificationEmail(params) {
    logger.info('userService.verificationEmail', params);
    try {
      const existingEmail = await userDao.selectUserByEmail(params);
      if (existingEmail) {
        return '이미 존재하는 이메일 입니다';
      }
      const emailToken = crypto.randomBytes(3).toString('hex').toUpperCase();
      console.log('verificationEmail token:', emailToken);
      try {
        console.log('in try', params.email);
        await sendVerificationEmail(params.email, emailToken);
        setVerifyToken(params.email, 300, emailToken);
        return '인증 이메일 전송 성공';
      } catch (err) {
        logger.error('userService.verificationEmailError: ', err.message);
        throw err;
      }
    } catch (err) {
      logger.error('userService.verificationEmail.Error: ', err);
      throw err;
    }
  },

  async verificationEmailCode(params) {
    logger.info('userService.verificationEmailCode: ', params);

    const verificationEmailCode = checkVerifyToken(params.email, params.code);
    return Promise.resolve(verificationEmailCode);
  },
};

export default userService;
