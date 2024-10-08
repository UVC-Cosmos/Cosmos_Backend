//app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import passport from './config/passport.js';
import session from 'express-session';
import { connectMQTT } from './config/mqttClient.js';
import initializeSocket from './config/socketConfig.js';
import http from 'http';
import db from './models/index.js';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import indexRouter from './routes/index.js';

const corsOptions = {
  origin: 'http://localhost:5173', // Vue 앱의 도메인
  credentials: true, // 자격 증명 허용
};

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.sequelize
  .authenticate()
  .then(() => {
    console.log('DB connection has been established successfully.');
    db.sequelize
      .sync({ alter: true })
      .then(async () => {
        console.log('DB sync has been established successfully');
        // 기존의 유니크 제약 조건 제거
        const queryInterface = db.sequelize.getQueryInterface();
        // user_notifications 테이블의 모든 제약 조건 가져오기
        const constraints = await queryInterface.showConstraint(
          'user_notifications'
        );

        // 특정 제약 조건이 있는지 확인
        const constraintExists = constraints.some(
          (constraint) =>
            constraint.constraintName ===
            'user_notifications_userId_notificationId_key'
        );

        if (constraintExists) {
          await queryInterface
            .removeConstraint(
              'user_notifications',
              'user_notifications_userId_notificationId_key'
            )
            .then(() => {
              console.log('Unique constraint removed successfully');
            })
            .catch((err) => {
              console.error('Failed to remove unique constraint', err);
            });
        } else {
          console.log('Constraint does not exist');
        }
      })
      .catch((err) => {
        console.error('db sync error', err);
      });
  })
  .catch((err) => {
    console.error('db connect fail!', err);
  });

// MQTT 서버에 연결
connectMQTT();

// Redis 클라이언트
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('connect', () => {
  console.log('Redis가 성공적으로 연결되었습니다.');
});

redisClient.on('error', (err) => {
  console.log('Redis Client Error:', err);
});

await redisClient.connect();

const RedisStoreInstance = new RedisStore({
  client: redisClient,
  prefix: 'sess:',
});

// 세션 설정
app.use(
  session({
    store: RedisStoreInstance,
    name: 'cosmosSession',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: '/', // 쿠키가 도메인의 모든 경로에서 유효하도록 설정합니다.
      secure: false, // 배포 환경에서는 secure 속성을 true로 설정하여 HTTPS를 통해서만 쿠키를 전송하도록 합니다.
      httpOnly: false, // JavaScript를 통해 쿠키에 접근하지 못하도록 설정하여 보안을 강화합니다.
      sameSite: 'strict', // CSRF 방지를 위해 SameSite 속성을 'strict'로 설정합니다.
      maxAge: 1 * 60 * 60 * 1000, // 쿠키의 유효 기간을 24시간(1일)으로 설정합니다.
    },
    unset: 'destroy',
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  try {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중 입니다.`);
  } catch (err) {
    console.error('서버가 정상적으로 실행이 되지 않습니다.', err);
  }
});

export { app, redisClient, io };
