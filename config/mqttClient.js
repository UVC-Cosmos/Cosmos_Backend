// ./config/mqttClient.js
import mqtt from 'mqtt';
import { processTagData } from '../libs/influxProcessor.js';

const MQTT_BROKER_URL = 'mqtt://192.168.0.19:1883'; // MQTT 브로커 URL
const MQTT_TOPIC = 'edge/edukit/status'; // 구독할 토픽

let client;

// 기존 값들을 저장할 객체
const previousValues = {};
let initCount = 0;

const connectMQTT = () => {
  client = mqtt.connect(MQTT_BROKER_URL);

  client.on('connect', () => {
    console.log('Connected to MQTT Broker');

    client.subscribe(MQTT_TOPIC, (err) => {
      if (!err) {
        console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
      } else {
        console.error('Subscription error:', err);
      }
    });
  });

  client.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());

      const tagId1ItemStart = data.find(
        (item) => item.tagId === '1' && item.value === true
      );
      const tagId1ItemStop = data.find(
        (item) => item.tagId === '1' && item.value === false
      );
      if (!tagId1ItemStart) return;
      if (tagId1ItemStop && initCount === 1) initCount = 0;

      const relevantTagIds = [
        '2',
        '8',
        '15',
        '16',
        '17',
        '25',
        '35',
        '37',
        '38',
      ];
      data.forEach((item) => {
        const { tagId, name, value } = item;
        // 저장하고 싶은 tagId만 필터링
        if (relevantTagIds.includes(tagId)) {
          if (previousValues[tagId] !== value) {
            console.log(`tagId: ${tagId}, name: ${name}, value: ${value}`);
            previousValues[tagId] = value;
            if (initCount === 1) {
              console.log('🚀 ~ data.forEach ~ processTagData:');
              processTagData(tagId, value); // InfluxDB 처리 함수 호출
            }
          }
        }
      });
      if (initCount === 0) {
        initCount = 1;
        return;
      }
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });

};

export { connectMQTT, client };
