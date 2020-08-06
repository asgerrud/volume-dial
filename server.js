require("dotenv").config();
const express = require("express");
const path = require("path");
const ip = require("ip");
const PubNub = require("pubnub");
const qr = require("qrcode-terminal");
const { audio } = require("system-control");

// Server
const app = express();
const port = 9000;
const ipAddress = ip.address() + ":" + port;

app.use(express.static(path.join(__dirname, "public")));
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.listen(port);

// Generate QR code
qr.generate("http:/" + ipAddress, function(qrcode) {
  console.log(qrcode);
});

// Pubnub
const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: process.env.PUBLISH_KEY,
  subscribeKey: process.env.SUBSCRIBE_KEY,
  uuid: uuid
});

// Volume change handler
const handleReceiveMessage = data => {
  const { volume, type } = data.message;
  switch (type) {
    case "SYSTEM_AUDIO":
      if (audio.muted()) {
        audio.muted(false);
      }
      audio.volume(volume);
      console.log("Volume: " + volume + "%");
    default:
      break;
  }
};

pubnub.addListener({
  message: handleReceiveMessage
});
pubnub.subscribe({
  channels: [process.env.CHANNEL]
});

console.log("Server listening on " + "http://" + ipAddress);
