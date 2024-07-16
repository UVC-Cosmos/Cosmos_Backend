import express from 'express';
import dotenv from 'dotenv';

import db from './models/index.js';

import indexRouter from './routes/index.js';

dotenv.config();

const app = express();
app.use(express.json());

db.sequelize.authenticate().then(() => {
  console.log('DB connection has been established successfully.');
  db.sequelize.sync({alter: true}).then(async () => {
    console.log('DB connection has been established successfully');
  }).catch((err) => { console.error('db sync error', err); });
}).catch((err) => { console.error('db connect fail!', err); });

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  try{
    console.log(`서버가 ${PORT}에서 실행 중 입니다.`)
  } catch(err){
    console.error('서버가 정상적으로 실행이 되지 않습니다.', err);
  }
})

export default app;