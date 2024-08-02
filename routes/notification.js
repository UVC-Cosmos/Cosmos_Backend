import express from 'express';
import logger from '../libs/logger.js';
import notificationService from '../services/notificationService.js';
import { isAuthenticated } from '../middlewares/index.js';

const router = express.Router();

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await notificationService.getNotifications(userId);
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('notification.get.Error', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id', async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notifications = await notificationService.addNotifications(
      notificationId
    );
    // 추가로직
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('notification.post.Error', error);
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:notificationId', async (req, res) => {
  try {
    const params = {
      userId: req.user.id,
      notificationId: req.params.notificationId,
    };

    const notifications = await notificationService.deleteNotification(params);
    // 추가로직
    res.status(200).json(notifications);
  } catch (error) {
    logger.error('notification.delete.Error', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
