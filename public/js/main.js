const degreeToPercent = (deg, min, max) => {
  return Math.round(((deg - min) / (max - min)) * 100);
};

const percentToDegree = (percent, min, max) => {
  return (percent / 100) * (max - min) + min;
};

const vibrate = (percent, tick = 25, stop = 50) => {
  window.navigator.vibrate(tick);
  if (percent == 0 || percent == 100) {
    window.navigator.vibrate(stop);
  }
};

const changeWindowsAudio = percent => {
  pubnub.publish(
    {
      channel: ["CHANNEL KEY GOES HERE"],
      message: {
        type: "SYSTEM_AUDIO",
        volume: percent
      }
    },
    status => {
      // Pubnub does not guarantee delivery. However, we can assume this if the message was delivered without errors
      if (status.error === false) {
        vibrate(percent);
        console.log("New volume: ", percent);
      }
    }
  );
};

const handleVolumeChange = (rotation, minDeg, maxDeg) => {
  let percent = degreeToPercent(rotation, minDeg, maxDeg);
  let activeTicks = Math.round((percent / 100) * NUM_TICKS + 1);

  if (activeTicks !== VolumeDial.activeTicks) {
    // Highlight ticks
    $(".tick").removeClass("active");
    $(".tick")
      .slice(0, activeTicks)
      .addClass("active");
    // Update number of active ticks
    VolumeDial.activeTicks = activeTicks;
  }

  if (percent !== VolumeDial.volume && percent % INCREMENT == 0) {
    VolumeDial.volume = percent;
    changeWindowsAudio(percent);
  }
};
