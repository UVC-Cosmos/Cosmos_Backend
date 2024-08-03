// influxProcessor.js

import { writeApi, Point } from '../config/influxClient.js';
import { io } from '../app.js';
import { getDiceStatistics } from './influxStatistics.js';
import notificationService from '../services/notificationService.js';
import { sendEventToUser } from './socketEvent.js';

const processTagData = async (tagId, value, previousValues) => {
  const currentTime = Date.now() * 1000000; // 타임스탬프를 나노초로 변환
  if (tagId === '2' && value === true) {
    // 1호기 자재 없음 알림 로직
    const notifications = await notificationService.addNotifications(3);
    notifications.forEach((notification) => {
      sendEventToUser(
        notification.userId,
        {
          id: notification.id,
          content: notification.content,
          createdAt: notification.createdAt,
        },
        io
      );
    });
  } else if (tagId === '15') {
    console.log(previousValues['36']);
    // 1호기 생산량
    const point = new Point('production')
      .tag('machine', '1')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
    if (parseInt(value) >= parseInt(previousValues['36'])) {
      console.log(
        '🚀 ~ processTagData ~ value >= previousValues:',
        value,
        typeof value,
        previousValues,
        typeof previousValues
      );
      // 목표생산량 도달 알림 로직
      const notifications = await notificationService.addNotifications(6);
      notifications.forEach((notification) => {
        sendEventToUser(
          notification.userId,
          {
            id: notification.id,
            content: notification.content,
            createdAt: notification.createdAt,
          },
          io
        );
      });
    }
  } else if (tagId === '16') {
    // 2호기 생산량
    const point = new Point('production')
      .tag('machine', '2')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
    if (parseInt(previousValues['15']) % 10 === 0) {
      // 10번째 생산때마다 1호기 불량률 체크 알림 로직
      const defectRate =
        ((parseInt(previousValues['15']) - parseInt(value)) /
          parseInt(previousValues['15'])) *
        100;
      console.log('🚀 ~ 1호기 processTagData ~ defectRate:', defectRate);
      if (defectRate >= 20) {
        const notifications = await notificationService.addNotifications(7);
        notifications.forEach((notification) => {
          sendEventToUser(
            notification.userId,
            {
              id: notification.id,
              content: notification.content,
              createdAt: notification.createdAt,
            },
            io
          );
        });
      }
    }
  } else if (tagId === '17') {
    // 3호기 생산량
    const point = new Point('production')
      .tag('machine', '3')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
    if (parseInt(previousValues['16']) % 10 === 0) {
      // 10번째 생산때마다 2호기 불량률 체크 알림 로직
      const defectRate =
        ((parseInt(previousValues['15']) - parseInt(value)) /
          parseInt(previousValues['15'])) *
        100;
      console.log('🚀 ~ 2호기 processTagData ~ defectRate:', defectRate);
      if (defectRate >= 20) {
        const notifications = await notificationService.addNotifications(9);
        notifications.forEach((notification) => {
          sendEventToUser(
            notification.userId,
            {
              id: notification.id,
              content: notification.content,
              createdAt: notification.createdAt,
            },
            io
          );
        });
      }
    }
  } else if (tagId === '25' && value === true) {
    // 2호기 자재 없음 알림 로직
    const notifications = await notificationService.addNotifications(4);
    notifications.forEach((notification) => {
      sendEventToUser(
        notification.userId,
        {
          id: notification.id,
          content: notification.content,
          createdAt: notification.createdAt,
        },
        io
      );
    });
  } else if (tagId === '35' && value === false) {
    // 비상 정지 이벤트
    const notifications = await notificationService.addNotifications(1);
    notifications.forEach((notification) => {
      sendEventToUser(
        notification.userId,
        {
          id: notification.id,
          content: notification.content,
          createdAt: notification.createdAt,
        },
        io
      );
    });
  } else if (tagId === '37') {
    const point = new Point('production')
      .tag('dice', value)
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
    writeApi.flush(); // 데이터가 즉시 저장되도록 강제 플러시

    // 주사위 통계 데이터를 가져와서 웹소켓으로 전송
    const diceStats = await getDiceStatistics();
    io.emit('diceStats', diceStats);
  } else if (tagId === '44' && value === '5') {
    // 적재량 full 알림 로직
    const notifications = await notificationService.addNotifications(5);
    notifications.forEach((notification) => {
      sendEventToUser(
        notification.userId,
        {
          id: notification.id,
          content: notification.content,
          createdAt: notification.createdAt,
        },
        io
      );
    });
  }
};

export { processTagData };

// // eventTrigger.js
// import { sendEventToUser } from './socketEvents.js';

// function triggerEvent(userId, message) {
//   const event = { type: 'notification', message };
//   sendEventToUser(userId, event);
// }

// // 특정 이벤트 발생 시 예제
// const userId = 1; // 알림을 보낼 사용자 ID
// const message = '새로운 알림이 있습니다.';
// triggerEvent(userId, message);
