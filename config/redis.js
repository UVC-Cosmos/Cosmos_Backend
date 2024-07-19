import { redisClient } from '../app.js';
import logger from '../libs/logger.js';

async function setVerifyToken(userEmail, expired, emailToken) {
  logger.info('redis.setVerifyToken', userEmail, expired, emailToken);
  try {
    await redisClient.setEx(userEmail, expired, emailToken);
  } catch (err) {
    logger.error('redis.setVerifyTokenError', err);
    throw err;
  }
}

async function checkVerifyToken(userEmail, inputTokenValue) {
  logger.info('redis.checkVerifyToken', userEmail, inputTokenValue);
  try {
    const storedToken = await redisClient.get(userEmail);
    if (storedToken == inputTokenValue) {
      console.log('verifyToken', inputTokenValue);
      return true;
    } else {
      console.log('wrong verifyToken', inputTokenValue);
      return false;
    }
  } catch (err) {
    console.error('verifyToken Error', err);
  }
}

process.on('exit', () => {
  client.quit();
});

export { setVerifyToken, checkVerifyToken };
