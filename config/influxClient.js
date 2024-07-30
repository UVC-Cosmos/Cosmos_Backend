// influxClient.js
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.INFLUXDB_TOKEN;
const org = process.env.INFLUXDB_ORG;
const bucket = process.env.INFLUXDB_BUCKET;

const influxDB = new InfluxDB({ url: process.env.INFLUXDB_URL, token });

const writeApi = influxDB.getWriteApi(org, bucket);
writeApi.useDefaultTags({ location: 'server' });

export const queryApi = influxDB.getQueryApi(org);

// 연결 확인
const checkInfluxDBHealth = () => {
  const url = new URL('/health', process.env.INFLUXDB_URL);
  http
    .get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        if (response.status === 'pass') {
          console.log('influxDB가 성공적으로 연결되었습니다.');
        } else {
          console.error('InfluxDB health check failed', response);
        }
      });
    })
    .on('error', (err) => {
      console.error('Error connecting to InfluxDB:', err);
    });
};

checkInfluxDBHealth();

export { writeApi, Point };
