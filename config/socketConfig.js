// socketConfig.js
import { Server } from 'socket.io';

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // CORS 문제 해결을 위해 모든 도메인에서 접근 허용
      methods: ['GET', 'POST'],
    },
  });

  // WebSocket 설정
  io.on('connection', (socket) => {
    console.log('클라이언트가 연결되었습니다.');

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('create', (edukitID, data) => {
      // console.log(`Received data from Edukit ${edukitID}: ${data}`);
      // 데이터를 같은 방의 다른 클라이언트들에게 전달
      socket.to(edukitID).emit('data', data);
    });

    socket.on('control', (edukitID, data) => {
      const sendEvent = `SEND${edukitID}`;
      console.log(`Received data from Front ${edukitID}: ${data}`);
      // 데이터를 같은 방의 다른 클라이언트들에게 전달
      socket.to(edukitID).emit(sendEvent, data);
    });

    socket.on('joinRoom', (room) => {
      console.log(`Joining room: ${room}`);
      socket.join(room);
    });

    socket.on('error', (err) => {
      console.error('Socket.IO 에러 발생:', err);
    });

    console.log('WebSocket server initialized');
  });

  return io;
};

export default initializeSocket;
