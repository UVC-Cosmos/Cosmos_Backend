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

  async getAllUsers() {
    logger.info('userService.getAllUsers');

    try {
      const users = await userDao.getAllUsers();
      console.log('userService.getAllUsers', users);
      return users;
    } catch (error) {
      logger.error('userService.getAllUsers Error', error);
      throw error;
    }
  },

  async updateUser(params) {
    logger.info('userService.updateUser', params);

    let newHashPassword = null;
    let newParams = null;

    if (params.password) {
      try {
        newHashPassword = await hashUtil.makeHashPassword(params.password);
      } catch (err) {
        logger.error('Error: userService.updateUser.newHashPassword', err);
        throw err;
      }
      newParams = {
        ...params,
        password: newHashPassword,
      };
    }
    try {
      const updateUser = await userDao.update(newParams ? newParams : params);
      return updateUser;
    } catch (err) {
      logger.error('Error: userService.updateUser.update', err);
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

  async duplicateCheck(params) {
    logger.info('userService.duplicateCheck', params);
    try {
      const user = await userDao.userLogin(params);
      if (!user) {
        return true;
      } else return false;
    } catch (err) {
      logger.error('userService.duplicateCheckError', err);
      throw err;
    }
  },

  async getUserInfo(params) {
    try {
      const user = await userDao.userInfo(params);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      logger.error('userService.getUserInfo Error', error);
      throw error;
    }
  },

  async passwordCheck(params) {
    try {
      const user = await userDao.userPasswordCheck(params);
      if(!user) {
        throw new Error('기존의 비밀번호가 일치하지 않음');
      }
      // 패스워드 정상적으로 넘어오는거 확인 했고, 해쉬화된 패스워드와 비교해야함
      const checkPasswordHash = await hashUtil.checkPasswordHash(params.password, user.password);
      return checkPasswordHash;

    }catch (error) {
        
    }
  },

  async putUserPass(params) {

    let newHashPassword = null;

    try {
      newHashPassword = await hashUtil.makeHashPassword(params.password);
    } catch (error) {
      logger.error('userService.putUserPass.makeHashPassword Error', error);
      throw err;
    }
    const newParams = {
      ...params,
      password: newHashPassword,
    };
    try {
      const updateUserPassword = await userDao.updateUserPassword(newParams);
      return updateUserPassword;
    } catch (error) {
      logger.error('userService.putUserPass Error', error);
      throw error;
    }
  }
};

export default userService;
