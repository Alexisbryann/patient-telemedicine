(async () => {
    let volumeCallback = null;
    let volumeInterval = null;
    const volumeVisualizer = document.getElementById('volume-visualizer');
    const startButton = document.getElementById('testMic');
    try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true
            }
        });
        const audioContext = new AudioContext();
        const audioSource = audioContext.createMediaStreamSource(audioStream);
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
            taxi.innerHTML = "Your microphone is working! 😇";
        };
    }
    catch (e) {
        console.error('Failed to initialize volume visualizer, simulating instead...', e);
        let lastVolume = 50;
        volumeCallback = () => {
            const volume = Math.min(Math.max(Math.random() * 100, 0.8 * lastVolume), 1.2 * lastVolume);
            lastVolume = volume;
            volumeVisualizer.style.setProperty('--volume', volume + '%');
            var taxi;
            taxi = document.getElementById("test-result");
            taxi.innerHTML = "Status: Microphone is not working! 😞";
            $('.mic').css("pointer-events", "none");
            $('.mic').css("opacity", "0.5");
        };
    }
    startButton.addEventListener('click', () => {
        if (volumeCallback !== null && volumeInterval === null)
            volumeInterval = setInterval(volumeCallback, 100);
    });
    
})();