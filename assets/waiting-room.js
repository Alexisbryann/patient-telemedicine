var appointment_id = $('#appointment_id').val();

if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    // Firefox 38+ seems having support of enumerateDevicesx
    navigator.enumerateDevices = function(callback) {
        navigator.mediaDevices.enumerateDevices().then(callback);
    };
}

var MediaDevices = [];
var isHTTPs = location.protocol === 'https:';
var canEnumerate = false;

if (typeof MediaStreamTrack !== 'undefined' && 'getSources' in MediaStreamTrack) {
    canEnumerate = true;
} else if (navigator.mediaDevices && !!navigator.mediaDevices.enumerateDevices) {
    canEnumerate = true;
}

var hasMicrophone = false;
var hasSpeakers = false;
var hasWebcam = false;

var isMicrophoneAlreadyCaptured = false;
var isWebcamAlreadyCaptured = false;

function checkDeviceSupport(callback) {
    if (!canEnumerate) { return; }
    if (!navigator.enumerateDevices && window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
        navigator.enumerateDevices = window.MediaStreamTrack.getSources.bind(window.MediaStreamTrack);
    }
    if (!navigator.enumerateDevices && navigator.enumerateDevices) {
        navigator.enumerateDevices = navigator.enumerateDevices.bind(navigator);
    }
    if (!navigator.enumerateDevices) {
        if (callback) { callback(); }
        return;
    }

    MediaDevices = [];
    navigator.enumerateDevices(function(devices) {
        devices.forEach(function(_device) {
            var device = {};
            for (var d in _device) {
                device[d] = _device[d];
            }

            if (device.kind === 'audio') {
                device.kind = 'audioinput';
            }

            if (device.kind === 'video') {
                device.kind = 'videoinput';
            }

            var skip;
            MediaDevices.forEach(function(d) {
                if (d.id === device.id && d.kind === device.kind) {
                    skip = true;
                }
            });

            if (skip) { return; }

            if (!device.deviceId) {
                device.deviceId = device.id;
            }

            if (!device.id) {
                device.id = device.deviceId;
            }

            if (!device.label) {
                device.label = 'Please invoke getUserMedia once.';
                // $('#permission-info').modal('show');
                if (!isHTTPs) {
                    device.label = 'HTTPs is required to get label of this ' + device.kind + ' device.';
                    // systemMessages('No https!');
                }
            } else {
                if (device.kind === 'videoinput' && !isWebcamAlreadyCaptured) {
                    isWebcamAlreadyCaptured = true;
                }
                if (device.kind === 'audioinput' && !isMicrophoneAlreadyCaptured) {
                    isMicrophoneAlreadyCaptured = true;
                }
            }

            if (device.kind === 'audioinput') {
                hasMicrophone = true;
            }

            if (device.kind === 'audiooutput') {
                hasSpeakers = true;
            }

            if (device.kind === 'videoinput') {
                hasWebcam = true;
            }
            // there is no 'videoouput' in the spec.
            MediaDevices.push(device);
        });

        if (callback) {
            callback();
        }
    });
}

// check for microphone/camera support!
checkDeviceSupport(function() {
    if (hasWebcam && hasMicrophone) {
        if (isMicrophoneAlreadyCaptured && isWebcamAlreadyCaptured) {
            systemMessages('Permission Granted!');
            setInterval(function () {
                $('.telemed-step-one').hide();
                $('.telemed-step-two').show();
                redirectToRoom();
            }, 5000);
        } else {
            // $('#permission-info').modal('show');
            // getLocalStream();
        }
    } else {
        systemMessages('No Devices!');
    }
});

$(document).on('click', '#give-permission', function () {
    getLocalStream();
    $('#permission-info').modal('show');
});

function getLocalStream() {
    if (location.protocol === 'https:') {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                audio: true,
                video: true
            }, function(stream) {
                var constraints = {audio: true,video: true};
                //call getUserMedia
                navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
                    // var video = document.querySelector('video');
                    // video.srcObject = mediaStream;
                    // video.play();
                    systemMessages('Permission Granted!');
                    redirectToRoom();
                }).catch(function(err) {
                    console.log("Error: " + err.message);
                });
                var mediaStreamTrack = stream.getVideoTracks()[0];
                if (typeof mediaStreamTrack != "undefined") {
                    mediaStreamTrack.onended = function() { //for Chrome.
                        systemMessages('Your webcam is busy!')
                    }
                } else {
                    systemMessages('Permission denied!');
                }
            }, function(e) {
                var message;
                switch (e.name) {
                    case 'NotFoundError':
                    case 'DevicesNotFoundError':
                        message = 'Please setup your webcam first.';
                        break;
                    case 'SourceUnavailableError':
                        message = 'Your webcam is busy';
                        break;
                    case 'PermissionDeniedError':
                        message = 'Permission denied!';
                        break;
                    case 'SecurityError':
                        message = 'Permission denied!';
                        location.reload();
                        break;
                    default:
                        systemMessages('Rejected!', e);
                        return;
                }
                systemMessages(message);
            });
        } else systemMessages('Incompatible browser!');
    } else systemMessages('No https!');
}

function systemMessages(message, e) {
    var permission_body, permission_title;
    if (message == 'Rejected!' || message == 'Permission denied!') {
        permission_title = 'Camera And Microphone Are Blocked';
        permission_body = 'MHA Telemedicine needs access to your camera and microphone so that other participants can see and hear you. Click the camera blocked icon <img src="images/psi/unblock-video.png" height="20px"/> in your browser\'s address bar to allow access or go to <b>Privacy and security</b> under your browser settings to allow access.';
    } else if (message == 'Incompatible browser!') {
        permission_title = 'Camera And Microphone Are Blocked';
        permission_body = 'MHA Telemedicine needs access to your camera and microphone. This browser is not compatible with the page you\'re trying to access, kindly switch to another browser.';
    } else if (message == 'No https!') {
        permission_title = 'Camera And Microphone Are Blocked';
        permission_body = 'MHA Telemedicine needs access to your camera and microphone. Use https protocol to open this page.';
    } else if (message == 'Your webcam is busy!') {
        permission_title = 'Camera And Microphone Are Blocked';
        permission_body = 'MHA Telemedicine needs access to your camera and microphone. Please close all the applications using your camera and microphone.';
    } else if (message == 'Permission Granted!') {
        permission_title = 'MHA Telemedicine Has Access To Your Camera And Microphone';
        permission_body = 'You have allowed MHA Telemedicine to access your camera and microphone so that other participants can see and hear you. You will be redirected shortly.';
    } else if (message == 'No Devices!') {
        permission_title = 'Camera And Microphone Not Detected';
        permission_body = 'Sorry, we could not detect camera and microphone in the device you\'re using. Please use a different device.';
    }
    $('#permission-title, #permission-body').html('');
    $('#permission-title').html(permission_title);
    $('#permission-body').html(permission_body);
    $('#permission-info').modal('show');
    console.error(message, typeof e == 'undefined' ? '' : e);
}

function redirectToRoom() {
    setInterval(function () {
        $('#permission-info').modal('hide');
        //Goto room preparation
        window.location.href = 'room-preparation.php?slp=' + appointment_id + '';
    }, 3000000);
}