const io = require('socket.io')(80, {
  cors: {
    origin: 'https://bryalv77.github.io/chat-io/',
    methods: ["GET", "POST"]
  }
});
console.log('Starting...');
const users = {}

io.on('connection', socket => {
  console.log('connected');
  socket.on('new-user', name => {
    console.log('new user', name);
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    console.log('send message', message);
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    console.log('disconnected');
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})