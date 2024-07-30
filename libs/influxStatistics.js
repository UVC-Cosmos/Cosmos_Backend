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

// 생산량 통계를 가져오는 함수
const getProductionStatistics = async (date) => {
  const targetDate = date || getTodayDate();
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${targetDate}T00:00:00Z, stop: ${targetDate}T23:59:59Z)
      |> filter(fn: (r) => r._measurement == "production")
      |> group(columns: ["machine"])
      |> sum(column: "_value")
  `;

  const result = await queryApi.collectRows(query);
  return result.reduce((acc, row) => {
    acc[row.machine] = row._value;
    return acc;
  }, {});
};

// 불량률 통계를 가져오는 함수
const getDefectRateStatistics = async (date) => {
  const targetDate = date || getTodayDate();
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${targetDate}T00:00:00Z, stop: ${targetDate}T23:59:59Z)
      |> filter(fn: (r) => r._measurement == "production")
      |> group(columns: ["machine"])
      |> sum(column: "_value")
  `;

  const result = await queryApi.collectRows(query);
  const stats = result.reduce((acc, row) => {
    acc[row.machine] = row._value;
    return acc;
  }, {});

  const machine1 = stats['1'] || 0;
  const machine2 = stats['2'] || 0;
  const machine3 = stats['3'] || 0;

  return {
    machine1DefectRate: machine1 - machine2,
    machine2DefectRate: machine2 - machine3,
    totalDefectRate: machine1 - machine3,
  };
};

// 주사위 비율 통계를 가져오는 함수
const getDiceStatistics = async (date) => {
  const targetDate = date || getTodayDate();
  const query = `
    from(bucket: "${bucket}")
      |> range(start: ${targetDate}T00:00:00Z, stop: ${targetDate}T23:59:59Z)
      |> filter(fn: (r) => r._measurement == "production")
      |> filter(fn: (r) => r._field == "count")
      |> group(columns: ["dice"])
  `;

  const result = await queryApi.collectRows(query);
  return result.reduce(
    (acc, row) => {
      if (row.dice >= 1 && row.dice <= 6) {
      }
      acc[row.dice] += row._value;
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  );
};

export { getProductionStatistics, getDefectRateStatistics, getDiceStatistics };
