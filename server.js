const path = require('path');
const ip = require('ip');
const qr = require('qrcode-terminal');
const { audio } = require('system-control');

// Server
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const PORT = 9000;
const IP = ip.address() + ':' + PORT;

const setVolume = volume => {
  if (audio.muted()) {
    audio.muted(false);
  }
  audio.volume(volume);
};

const printVolumePercentage = percentage => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write('Volume: ' + percentage + '%');
};

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', socket => {
  socket.emit('system-volume', audio.volume());
  socket.on('volume-change', percentage => {
    if (percentage !== audio.volume()) {
      setVolume(percentage);
      printVolumePercentage(percentage);
      socket.broadcast.emit('system-volume', percentage);
    }
  });
});

server.listen(PORT, () => {
  qr.generate('http:/' + IP, qrcode => {
    console.log(qrcode);
  });
  console.log('Server listening on ' + 'http://' + IP);
});
