// ./libs/influxStatistics.js

import { queryApi } from '../config/influxClient.js';
import dotenv from 'dotenv';

dotenv.config();

const bucket = process.env.INFLUXDB_BUCKET;

// 오늘 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// 시작 날짜를 구하는 함수 추가
const getStartDate = async () => {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "production")
      |> sort(columns: ["_time"], desc: false)
      |> limit(n: 1)
      |> keep(columns: ["_time"])
  `;
  const result = await queryApi.collectRows(query);
  return result.length > 0 ? result[0]._time.split('T')[0] : getTodayDate(); // 가장 오래된 날짜 반환
};

// 생산량 통계를 가져오는 함수
const getProductionStatistics = async () => {
  const startDate = await getStartDate(); // 시작 날짜
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startDate}T00:00:00Z, stop: now())
      |> filter(fn: (r) => r._measurement == "production")
      |> group(columns: ["_time", "machine"])
      |> sum(column: "_value")
  `;

  const result = await queryApi.collectRows(query);
  return result.reduce((acc, row) => {
    const date = row._time.split('T')[0]; // 날짜 추출
    if (!acc[date]) {
      acc[date] = {};
    }
    // machine 값이 acc[date]에 없으면 초기화
    if (!acc[date][row.machine]) {
      acc[date][row.machine] = 0;
    }

    // _value를 숫자로 변환하여 더하기
    acc[date][row.machine] += parseFloat(row._value);
    return acc;
  }, {});
};

// 불량률 통계를 가져오는 함수
const getDefectRateStatistics = async () => {
  const startDate = await getStartDate();
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startDate}T00:00:00Z, stop: now())
      |> filter(fn: (r) => r._measurement == "production")
      |> group(columns: ["_time", "machine"])
      |> sum(column: "_value")
  `;

  const result = await queryApi.collectRows(query);
  const stats = result.reduce((acc, row) => {
    const date = row._time.split('T')[0]; // 날짜 추출
    if (!acc[date]) {
      acc[date] = {};
    }
    // machine 값이 acc[date]에 없으면 초기화
    if (!acc[date][row.machine]) {
      acc[date][row.machine] = 0;
    }

    // _value를 숫자로 변환하여 더하기
    acc[date][row.machine] += parseFloat(row._value);
    return acc;
  }, {});

  // 날짜별로 불량률 계산
  return Object.entries(stats).reduce((acc, [date, machines]) => {
    const machine1 = machines['1'] || 0;
    const machine2 = machines['2'] || 0;
    const machine3 = machines['3'] || 0;
    acc[date] = {
      machine1DefectRate: machine1 - machine2,
      machine2DefectRate: machine2 - machine3,
      totalDefectRate: machine1 - machine3,
    };
    return acc;
  }, {});
};

// 주사위 비율 통계를 가져오는 함수
const getDiceStatistics = async () => {
  const startDate = await getStartDate();
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${startDate}T00:00:00Z, stop: now())
      |> filter(fn: (r) => r._measurement == "production")
      |> filter(fn: (r) => r._field == "count")
      |> group(columns: ["_time", "dice"])
  `;

  const result = await queryApi.collectRows(query);
  return result.reduce((acc, row) => {
    const date = row._time.split('T')[0];
    if (!acc[date]) {
      acc[date] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    }
    if (row.dice >= 1 && row.dice <= 6) {
      acc[date][row.dice] += row._value;
    }
    return acc;
  }, {});
};

export { getProductionStatistics, getDefectRateStatistics, getDiceStatistics };
