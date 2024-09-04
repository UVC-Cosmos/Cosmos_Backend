import User from '../models/user.js';
import UserNotification from '../models/userNotification.js';
import Notification from '../models/notification.js';

import logger from '../libs/logger.js';

const notificationDao = {
  async insert(params) {
    logger.info('notificationDao.insert', params);
    try {
      const data = params.users.map((user) => {
        return {
          userId: user,
          notificationId: params.notificationId,
        };
      });
      const result = await UserNotification.bulkCreate(data);

      return result;
    } catch (error) {
      logger.error('notificationDao.insert.Error', error);
      throw error;
    }
  },
  async delete(params) {
    logger.info('notificationDao.delete', params);
    try {
      const result = await UserNotification.destroy({
        where: {
          id: params.notificationId,
        },
      });
      console.log('🚀 ~ delete ~ result:', result);
      return result;
    } catch (error) {
      logger.error('notificationDao.delete.Error', error);
      throw error;
    }
  },

  async select(params) {
    logger.info('notificationDao.select', params);
    try {
      const result = await UserNotification.findAll({
        where: { userId: params.userId },
        order: [['createdAt', 'ASC']],
      });
      return result;
    } catch (error) {
      logger.error('notificationDao.select.Error', error);
      throw error;
    }
  },

  async getNotificationContent(notificationId) {
    logger.info('notificationDao.getNotificationContent', notificationId);
    try {
      const result = await Notification.findByPk(notificationId);

      return result.content;
    } catch (error) {
      logger.error('notificationDao.select.Error', error);
      throw error;
    }
  },

  async selectById(notificationId) {
    logger.info('notificationDao.selectById', notificationId);
    try {
      const result = await Notification.findByPk(notificationId);
      if (result) {
        console.log('notificationDao.selectById result ', result.dataValues);
      }
      return result;
    } catch (error) {
      logger.error('notificationDao.selectById.Error', error);
      throw error;
    }
  },
};

export default notificationDao;
