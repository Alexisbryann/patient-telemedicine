var config = { audio: true,video: { facingMode: 'user', width: 50} };

var start = () => navigator.mediaDevices.getUserMedia(config)
  .then(stream => v.srcObject = stream)
  .then(() => new Promise(resolve => v.onloadedmetadata = resolve))
  .then(() => log("Successfully Allowed: " + v.videoWidth + "x" + v.videoHeight))
  .catch(log);