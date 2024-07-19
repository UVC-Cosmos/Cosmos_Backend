import express from 'express';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import session from 'express-session';
import { connect } from './config/mqttClient.js';
import initializeSocket from './config/socketConfig.js';
import http from 'http';



import db from './models/index.js';

import indexRouter from './routes/index.js';

dotenv.config();


const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.use(express.json());

db.sequelize.authenticate().then(() => {
  console.log('DB connection has been established successfully.');
  db.sequelize.sync({alter: true}).then(async () => {
    console.log('DB connection has been established successfully');
  }).catch((err) => { console.error('db sync error', err); });
}).catch((err) => { console.error('db connect fail!', err); });

// MQTT 서버에 연결
connect();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 hour
  }
 }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  try{
    console.log(`서버가 ${PORT}에서 실행 중 입니다.`)
  } catch(err){
    console.error('서버가 정상적으로 실행이 되지 않습니다.', err);
  }
})

export default app;