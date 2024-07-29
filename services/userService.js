import userDao from '../dao/userDao.js';
import logger from '../libs/logger.js';
import hashUtil from '../libs/hashUtil.js';
import sendVerificationEmail from '../services/emailService.js';
import { setVerifyToken, checkVerifyToken } from '../config/redis.js';
import crypto from 'crypto';
import factoryDao from '../dao/factoryDao.js';

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
      if (!user) {
        throw new Error('기존의 비밀번호가 일치하지 않음');
      }
      // 패스워드 정상적으로 넘어오는거 확인 했고, 해쉬화된 패스워드와 비교해야함
      const checkPasswordHash = await hashUtil.checkPasswordHash(
        params.password,
        user.password
      );
      return checkPasswordHash;
    } catch (error) {}
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
  },

  async deleteUser(params) {
    console.log('userService.deleteUser', params);
    try {
      const deleteUser = await userDao.deleteUser(params);
      return deleteUser;
    } catch (error) {
      logger.error('userService.deleteUser Error', error);
      throw error;
    }
  },

  async updateUserFactory(params) {
    logger.info('userService.updateUserFactory', params);

    try {
      // 1. 사용자가 존재하는지 확인
      const user = await userDao.getUserById(params);
      if (!user) {
        return { success: false, message: '사용자가 존재하지 않습니다.' };
      }

      // 2. 기존에 사용자가 소속된 공장 정보 초기화
      await userDao.removeUserFactories(params);

      // 3. 공장 이름으로 공장 ID 조회
      const getFactoriesId = await factoryDao.getFactoryIdByName(params);
      const newParams = {
        id: params.id,
        factoryIds: getFactoriesId,
      };

      // 3. 사용자의 새로운 공장 연결 추가
      const addUserFactories = await userDao.addUserFactories(newParams);
      if (!addUserFactories) {
        console.log('addUserFactories', addUserFactories.dataValues);
      }
      return addUserFactories;
    } catch (error) {
      logger.error('userService.updateUserFactory Error', error);
      throw error;
    }
  },

  // test factories 불러오기
  async getAllFactories() {
    try {
      const result = await factoryDao.getAllFactories();
      return result;
    } catch (error) {
      logger.error('userService.getAllFactories Error', error);
      throw error;
    }
  },

  async getFactoryUsers(factoryId) {
    logger.info('userService.getFactoryUsers', factoryId);
    try {
      const result = await userDao.getFactoryUsers(factoryId);
      return result;
    } catch (error) {
      logger.error('userService.getFactoryUsers Error', error);
      throw error;
    }
  },

  async updateUserLineControl(params) {
    logger.info('userService.updateUserLineControl', params);
    // params { id: '2', userId: 1, lines: [ '2', '3' ] }

    // 유효성 검사 id, lines, userId가 존재하는지 배열 비어있는지 확인
    if (
      !params.id ||
      !Array.isArray(params.lines) ||
      params.lines.length === 0
    ) {
      return { success: false, message: '잘못된 요청입니다.' };
    }

    try {
      // userId(factoryAdmin)을 통한 admin의 소속 공장 확인
      const user = await userDao.userInfo(params);

      // 권한 검사 : 사용자 존재하는지, role이 factoryAdmin을 포함하고 있는지 확인
      if (!user || !user.role.includes('factoryAdmin')) {
        return { success: false, message: '권한이 없습니다.' };
      }

      // 역할에 따른 공자 ID 확인 :  사용자의 role에 따라서 관라히는 공장 ID 가져옴
      const factoryId = this.getFactoryIdByRole(user.role);

      // 유효한 공장 ID인지 확인 : 역할이 유효하지 않다면, 에러 메세지 반환
      if (!factoryId) {
        return { success: false, message: '유효하지 않은 역할 입니다.' };
      }

      const newParams = {
        id: params.id,
        lines: params.lines,
        factoryId: factoryId,
      };

      // 기존 사용자의 line 정보 초기화 (해당 공장에 대한)
      await userDao.removeUserLineControl(newParams);
      // 새로운 line제어 권한 추가: 지정된 라인에 대한 권한 추가
      await userDao.addUserLinePermission(newParams);

      return { success: true, message: '변경 성공' };
    } catch (error) {
      logger.error('userService.updateUserLineControl Error', error);
      throw error;
    }
  },

  getFactoryIdByRole(role) {
    const roleFactoryMap = {
      'A-factoryAdmin': 1,
      'B-factoryAdmin': 2,
      'C-factoryAdmin': 3,
    };

    return roleFactoryMap[role] || null;
  },
};

export default userService;
