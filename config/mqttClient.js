// mqttClient.js

import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'mqtt://192.168.0.19:1883'; // MQTT 브로커 URL
const MQTT_TOPIC = 'edge/edukit/status'; // 구독할 토픽

let client;

const connect = () => {
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

  // client.on('message', (topic, message) => {
  //   // 수신된 메시지 처리
  //   // console.log(`Received message: ${message.toString()} on topic: ${topic}`);
  // });

  // client.on('error', (err) => {
  //   console.error('MQTT error:', err);
  // });
};

export { connect, client };
