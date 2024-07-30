import express from 'express';
import userRouter from './user.js';
import authRouter from './auth.js';
import adminRouter from './admin.js';
import historyRouter from './history.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send("CosMos's index page");
});

router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/admin', adminRouter);
router.use('/history', historyRouter);

export default router;
