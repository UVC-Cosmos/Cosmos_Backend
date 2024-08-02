// ./config/mqttClient.js
import mqtt from 'mqtt';
import { processTagData } from '../libs/influxProcessor.js';

const MQTT_BROKER_URL = 'mqtt://192.168.0.19:1883'; // MQTT 브로커 URL
const MQTT_TOPIC = 'edge/edukit/status'; // 구독할 토픽

let client;

// 기존 값들을 저장할 객체
const previousValues = {};

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

      const relevantTagIds = [
        '2', // No1ChipEmpty
        '8', // ResetState
        '15', // No1Count
        '16', // No2Count
        '17', // No3Count
        '25', // No2CubeFull
        '35', // EmergencyState
        '36', // InputLimit
        '37', // DiceValue
        '38', // DiceComparisonValue
        '44', // No3FullCount
      ];
      data.forEach((item) => {
        const { tagId, name, value } = item;
        // 저장하고 싶은 tagId만 필터링
        if (relevantTagIds.includes(tagId)) {
          if (previousValues[tagId] !== value) {
            console.log(`tagId: ${tagId}, name: ${name}, value: ${value}`);
            if (previousValues[tagId] !== undefined) {
              processTagData(tagId, value, previousValues); // InfluxDB 처리 함수 호출
            }
            previousValues[tagId] = value;
          }
        }
      });
    } catch (error) {
      console.error('Failed to process message:', error);
    }
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err);
  });
};

export { connectMQTT, client };
