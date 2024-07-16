import winston from "winston";
import 'winston-daily-rotate-file';
import fs from "fs";
import path from 'path';
import dotenv from "dotenv";

dotenv.config();

const projectRoot = path.resolve(); // 프로젝트 루트 디렉터리 설정
const logDirectory = path.join(projectRoot, 'logs'); // 로그 디렉터리 경로 설정

// log 디렉터리 없을 시 만들어줌
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// 일별 로그 파일 생성 설정
const transport = new winston.transports.DailyRotateFile({
  filename: 'cosmosproj-%DATE%.log',
  dirname: logDirectory,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // 압축 여부
  maxSize: '20m', // 20MB 이상일 경우 zip 파일로
  maxFiles: '14d', // 로그 파일을 최대 몇 일간 보관할지
});

const logger = winston.createLogger({
  level: process.env.LOGGER_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss'}),
    winston.format.printf(({ timestamp, level, message}) => {
      return `${timestamp} [${level}] ${message}`; // 로그 메세지 형식
    })
  ),
  transports: [
    // error 레벨 이상의 로그만 기록
    new winston.transports.File({ filename: path.join(logDirectory, 'error.log'), level: 'error'}), 
    transport // 파일에 로그 저장
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

export default logger;
