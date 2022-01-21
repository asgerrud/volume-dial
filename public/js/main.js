const degreeToPercent = (deg, min, max) => Math.round(((deg - min) / (max - min)) * 100);
const percentToDegree = (percent, min, max) => (percent / 100) * (max - min) + min;

const START_VOLUME = 50;
const INCREMENT = 5;
const MIN_DEG = 180;
const MAX_DEG = 360 + MIN_DEG;
const START_DEG = percentToDegree(START_VOLUME, MIN_DEG, MAX_DEG);
const NUM_TICKS = 100 / INCREMENT;

const vibrate = (percent, tick = 25, stop = 50) => {
  window.navigator.vibrate(tick);
  if (percent == 0 || percent == 100) {
    window.navigator.vibrate(stop);
  }
};

const setDial = percent => {
  dial.angle(percentToDegree(percent, MIN_DEG, MAX_DEG));
};

const receiveVolume = percent => {
  handleVolumeChange(percent, false);
};

const handleVolumeChange = (percent, emitChange = true) => {
  const activeTicks = Math.round((percent / 100) * NUM_TICKS + 1);

  if (activeTicks !== VolumeDial.activeTicks) {
    // Highlight ticks
    const ticks = document.querySelectorAll('.tick');
    ticks.forEach(el => el.classList.remove('active'));
    [...ticks].slice(0, activeTicks).forEach(el => el.classList.add('active'));
    VolumeDial.activeTicks = activeTicks;
  }
  if (percent !== VolumeDial.volume && percent % INCREMENT == 0) {
    VolumeDial.volume = percent;
    vibrate(percent);
    if (emitChange) socket.emit('volume-change', percent);
  }
};

var VolumeDial = {
  id: 'VolumeDial',
  volume: START_VOLUME,
  activeTicks: 0,
};

const config = {
  debug: false,
  touchMode: 'wheel',
  knobSize: '30px',
  wheelSize: '200px',
  zIndex: 9999,
  degreeStartAt: 90,
  minDegree: MIN_DEG,
  maxDegree: MAX_DEG,
};

const dial = JogDial(document.getElementById(VolumeDial.id), config).on('mousemove', e => {
  const percent = degreeToPercent(e.target.rotation, MIN_DEG, MAX_DEG);
  handleVolumeChange(percent);
});

const renderVolumeTicks = numberOfTicks => {
  const parent = document.getElementById('VolumeTicks');
  const rotationIncrement = 360 / numberOfTicks;
  const startRotation = -rotationIncrement;
  let rotation = startRotation + 180;

  var ticks = '';
  for (let i = 0; i < numberOfTicks; i++) {
    let newRotation = rotation + rotationIncrement;
    ticks += `<div class="tick" style="transform: rotate(${newRotation}deg)"></div>`;
    rotation = newRotation;
  }
  parent.innerHTML = ticks;
};

renderVolumeTicks(NUM_TICKS);
dial.angle(START_DEG);
