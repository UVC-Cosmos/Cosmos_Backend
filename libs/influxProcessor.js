// influxProcessor.js

import { writeApi, Point } from '../config/influxClient.js';
import { io } from '../app.js';
import { getDiceStatistics } from './influxStatistics.js';

const processTagData = async (tagId, value) => {
  const currentTime = Date.now() * 1000000; // 타임스탬프를 나노초로 변환
  if (tagId === '2' && value === true) {
    // 1호기 자재 없음 이벤트
    const point = new Point('event')
      .tag('machine', '1')
      .stringField('eventType', 'No1ChipEmpty')
      .booleanField('status', true)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '15') {
    // 1호기 생산량
    const point = new Point('production')
      .tag('machine', '1')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '16') {
    // 2호기 생산량
    const point = new Point('production')
      .tag('machine', '2')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '17') {
    // 3호기 생산량
    const point = new Point('production')
      .tag('machine', '3')
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '25' && value === false) {
    // 2호기 자재 없음 이벤트
    const point = new Point('event')
      .tag('machine', '2')
      .stringField('eventType', 'No2CubeFull')
      .booleanField('status', false)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '35' && value === 'false') {
    // 비상 정지 이벤트
    const point = new Point('event')
      .tag('machine', 'all')
      .stringField('eventType', 'EmergencyState')
      .booleanField('status', false)
      .timestamp(currentTime);
    writeApi.writePoint(point);
  } else if (tagId === '37') {
    // 비상 정지 이벤트
    const point = new Point('production')
      .tag('dice', value)
      .intField('count', 1)
      .timestamp(currentTime);
    writeApi.writePoint(point);
    writeApi.flush(); // 데이터가 즉시 저장되도록 강제 플러시

    // 주사위 통계 데이터를 가져와서 웹소켓으로 전송
    const diceStats = await getDiceStatistics();
    io.emit('diceStats', diceStats);
  }
};

export { processTagData };
