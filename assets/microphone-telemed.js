var constraints = { audio: true };
const startButton = document.getElementById('testMic');
startButton.addEventListener('click', () => {
    testMic();
});

var testMic = () => navigator.mediaDevices.getUserMedia(constraints).then( function (stream) {
    let volumeCallback = null;
    let volumeInterval = null;
    const volumeVisualizer = document.getElementById('volume-visualizer');
    
    try {
        // const audioStream = navigator.mediaDevices.getUserMedia({
        //     audio: {
        //         echoCancellation: true
        //     }
        // });
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyser.minDecibels = -127;
        analyser.maxDecibels = 0;
        analyser.smoothingTimeConstant = 0.4;
        audioSource.connect(analyser);
        const volumes = new Uint8Array(analyser.frequencyBinCount);
        volumeCallback = () => {
            analyser.getByteFrequencyData(volumes);
            let volumeSum = 0;
            for (const volume of volumes)
                volumeSum += volume;
            const averageVolume = volumeSum / volumes.length;
            volumeVisualizer.style.setProperty('--volume', (averageVolume * 100 / 127) + '%');
            var taxi;
            taxi = document.getElementById("test-result");
            taxi.innerHTML = "Your microphone is working! ðŸ˜‡";
        };
    }
    catch (e) {
        volumeCallback = () => {
            var taxi;
            taxi = document.getElementById("test-result");
            taxi.innerHTML = "Status: Microphone is not working! ðŸ˜ž";
            $('.mic').css("pointer-events", "none");
            $('.mic').css("opacity", "0.5");
        };
    }
    if (volumeCallback !== null && volumeInterval === null)
        volumeInterval = setInterval(volumeCallback, 100);
    
});