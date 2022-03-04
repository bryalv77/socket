const express = require('express');
const socketIO = require('socket.io');
const cors = require('cors')

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const app = express();

app.use(cors());
app.use((req, res) => {
  res.sendFile(INDEX, { root: __dirname });
});

const server = app.listen(PORT, () => {
  console.log("Listening on port: " + PORT);
});

const io = socketIO(server);

const users = {};

io.on('connection', (socket) => {
  console.log('Client connected');
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
    console.log('Client disconnected');
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);