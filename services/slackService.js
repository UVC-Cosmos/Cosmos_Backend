import axios from 'axios';

const sendSlackNotification = async (message) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;

  try {
    await axios.post(slackWebhookUrl, {
      text: message,
    });
    console.log('슬랙 알림 발송 성공');
  } catch (err) {
    console.error('슬랙 알림 발송 실패', err);
  }
};

export default sendSlackNotification;
