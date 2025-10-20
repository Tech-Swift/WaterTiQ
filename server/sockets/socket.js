// sockets/socket.js
const socketIo = require('socket.io');

const setupSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log('✅ New client connected:', socket.id);

    socket.on('registerUser', (user) => {
      activeUsers.set(socket.id, user);
      console.log('🪪 Registered:', user);
    });

    socket.on('disconnect', () => {
      console.log('❌ Client disconnected:', socket.id);
      activeUsers.delete(socket.id);
    });
  });

  return io;
};

module.exports = setupSocket;
