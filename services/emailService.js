import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.naver.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  try {
    const info = await transporter.sendMail({
      from: `"TEAM COSMOS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '이메일 인증 코드 발송',
      html: `
      <h1>안녕하세요!</h1>
      <p> COSMOS에 가입하신 것을 환영합니다.</p>
      <p>인증 코드: ${token}</p>
      <p>인증 코드 5분 이내로 입력하시면 회원가입을 진행하실 수 있습니다.</p>`,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('이메일 전송 중 오류가 발생했습니다.');
  }
};

export default sendVerificationEmail;
