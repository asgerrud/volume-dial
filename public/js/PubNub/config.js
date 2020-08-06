const uuid = PubNub.generateUUID();

const pubnub = new PubNub({
  publishKey: "PUBLISH KEY GOES HERE",
  subscribeKey: "SUBSCRIBE KEY GOES HERE",
  uuid: uuid
});

pubnub.subscribe({
  channels: ["CHANNEL GOES HERE"]
});
