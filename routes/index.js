import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import adminRouter from './admin.js';
import factoryAdmin from './factoryAdmin.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send("CosMos's index page");
});

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/factoryAdmin', factoryAdmin);

export default router;
