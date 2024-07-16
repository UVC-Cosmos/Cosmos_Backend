import express  from 'express';
import userRouter from './user.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('CosMos\'s index page');
});

router.use('/user', userRouter);

export default router;