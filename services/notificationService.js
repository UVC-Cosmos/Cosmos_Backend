import notificationDao from '../dao/notificationDao.js';
import userDao from '../dao/userDao.js';
import logger from '../libs/logger.js';

const notificationService = {
  async getNotifications(userId) {
    logger.info('getNotifications', userId);

    try {
      const notifications = await notificationDao.select({ userId: userId });
      const result = await Promise.all(
        notifications.map(async (r) => ({
          id: r.id,
          userId: r.userId,
          content: await notificationDao.getNotificationContent(
            r.notificationId
          ),
          createdAt: r.createdAt,
        }))
      );
      return result;
    } catch (error) {
      logger.error('notificationService.getNotifications Error', error);
      throw error;
    }
  },

  async addNotifications(notificationId) {
    logger.info('addNotifications', notificationId);
    try {
      const notification = await notificationDao.selectById(notificationId);
      if (!notification) {
        throw new Error('notification not found');
      }
      const usersInfo = await userDao.getFactoryUsersForNotification(
        notification.factoryId
      );
      if (!usersInfo) {
        throw new Error('usersInfo not found');
      }
      const users = usersInfo.map((user) => {
        return user.id;
      });
      console.log('🚀 ~ addNotifications ~ users:', users);
      const params = {
        users: users,
        notificationId: notificationId,
      };
      const notifications = await notificationDao.insert(params);
      const result = await Promise.all(
        notifications.map(async (r) => ({
          id: r.id,
          userId: r.userId,
          content: await notificationDao.getNotificationContent(
            r.notificationId
          ),
          createdAt: r.createdAt,
        }))
      );

      return result;
    } catch (error) {
      logger.error('notificationService.addNotifications Error', error);
      throw error;
    }
  },

  async deleteNotification(params) {
    logger.info('deleteNotification', params);
    try {
      let result = null;
      const notifications = await notificationDao.delete(params); // params = {userId: ??, notificationId: ??}
      if (notifications) {
        result = await notificationDao.select({ userId: params.userId });
      }
      return result === null ? notifications : result;
    } catch (error) {
      logger.error('notificationService.deleteNotification Error', error);
      throw error;
    }
  },
};

export default notificationService;
