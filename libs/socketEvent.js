// socketEvents.js
const userConnections = new Map();

function addUserConnection(socket, userId) {
  console.log('🚀 ~ addUserConnection ~ socket:', socket);
  console.log('🚀 ~ addUserConnection ~ userId:', userId);
  userConnections.set(socket, userId);
}

function removeUserConnection(socket) {
  console.log('🚀 ~ removeUserConnection ~ socket:', socket);
  userConnections.delete(socket);
}

function sendEventToUser(userId, event, io) {
  console.log('🚀 ~ sendEventToUser ~ event:', event);
  console.log('🚀 ~ sendEventToUser ~ userId:', userId);
  const socketId = findKeyByValue(userConnections, userId);
  if (socketId) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket) {
      console.log(`Sending event to user ${userId}:`, event);
      socket.emit('notifications', event);
    } else {
      console.error('Socket not found for user:', userId);
    }
  }
}
const findKeyByValue = (map, value) => {
  for (let [key, val] of map.entries()) {
    if (val == value) {
      return key;
    }
  }
  return null;
};
export { addUserConnection, removeUserConnection, sendEventToUser };
