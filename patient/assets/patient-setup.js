$(document).ready( function () {
    var patient_name = $('#patient_first_name').val();
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
    
    var currentTab = 0; // Current tab is set to be the first tab (0)
    showTab(currentTab); // Display the current tab

    $(document).on('click', '.nextBtn', function () {
        if (currentTab == 0) {
            nextStep(1);
            $('.permissions').css("pointer-events", "none");
            $('.permissions').css("opacity", "0.5");
        } else if (currentTab == 1) {
            // check for microphone/camera support!
           checkDeviceSupport(function() {
               if (hasWebcam && hasMicrophone) {
                   if (isMicrophoneAlreadyCaptured && isWebcamAlreadyCaptured) {
                        nextStep(1);
                   } else {
                        $('#permission-title, #permission-body').html('');
                        $('#permission-title').html('Camera And Microphone Are Blocked');
                        $('#permission-body').html('Hey <b>' + patient_name + '</b>, Tunza clinic telemedicine needs access to your camera and microphone. Click the camera blocked icon <img src="images/psi/unblock-video.png" height="20px"/> in your browser\'s address bar to allow access or go to <b>Privacy and security</b> under your browser settings to allow access.');
                        $('#permission-info').modal('show');
                   }
               } else {
                    $('#permission-title, #permission-body').html('');
                    $('#permission-title').html('Camera And Microphone Not Detected');
                    $('#permission-body').html('Sorry <b>' + patient_name + '</b>, we could not detect camera and microphone in the device you\'re using. Please use a different device.');
                    $('#permission-info').modal('show');
               }
           });
        } else {
            nextStep(1);
        }
    });
    $(document).on('click', '.prevBtn', function () {
        nextStep(-1);
    });
    $(document).on('click', '.vidOff', function () {
        vidOff(1);
    });
    $(document).on('click', '#allowPermissions', function () {
        allowPermissions();
    });
    // $(document).on('click', '.testMic', function () {
    //     testMicrophone();
    // });
    $(document).on('click', '#testInternet', function () {
        testInternetConnection();
    });

    function nextStep(n) {
        var x = document.getElementsByClassName("tab");
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
    }

    function showTab(n) {
        // This function will display the specified tab of the form...
        var x = document.getElementsByClassName("tab");
        x[n].style.display = "block";
        //... and fix the Previous/Next buttons:
        if (n == 0) {
            document.getElementById("prevBtn").style.display = "none";
        } else {
            document.getElementById("prevBtn").style.display = "inline";
        }
        if (n == (x.length - 1)) {
            document.getElementById("nextBtn").innerHTML = "Submit";
        } else if (n == 0){
            document.getElementById("nextBtn").innerHTML = "Get Started";
        } else if (n == (x.length - 1)){
            document.getElementById("nextBtn").innerHTML = "Next";
        }
        //... and run a function that will display the correct step indicator:
        fixStepIndicator(n)
    }

    function vidOff(n) {
        var videoEl = document.getElementById('v');
        stream = videoEl.srcObject;
        tracks = stream.getTracks();
        tracks.forEach(function(track) {
            track.stop();
        });
        videoEl.srcObject = null;
        var x = document.getElementsByClassName("tab");
        x[currentTab].style.display = "none";
        currentTab = currentTab + n;
        showTab(currentTab);
    }

    function fixStepIndicator(n) {
        console.log(n);
        var i, x = document.getElementsByClassName("step");
        for (i = 0; i < x.length; i++) {
            x[i].className = x[i].className.replace(" active", "");
        }
        console.log(x);
        x[n].className += " active";
    }

    /****************ALLOW CAMERA AND MICROPHONE START*********************/
    function allowPermissions() {
        if (location.protocol === 'https:') {
            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            if (navigator.getUserMedia) {
                navigator.getUserMedia({
                    audio: true,
                    video: true
                }, function(stream) {
                    var constraints = {audio: true,video: { width: 50 }};
                    //call getUserMedia
                    navigator.mediaDevices.getUserMedia(constraints).then(stream => v.srcObject = stream)
                    .then(() => new Promise(resolve => v.onloadedmetadata = resolve))
                    .then(() => {
                        $('.permissions').css("opacity", "1");
                        $('.permissions').css("pointer-events", "auto");
                    })
                    .catch(function(err) {
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
            permission_body = 'MHA Telemedicine needs access to your camera and microphone. Click the camera blocked icon <img src="images/psi/unblock-video.png" height="20px"/> in your browser\'s address bar to allow access or go to <b>Privacy and security</b> under your browser settings to allow access.';
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
            permission_body = 'You have allowed MHA Telemedicine to access your camera and microphone so that other participants can see and hear you.';
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
    /****************ALLOW CAMERA AND MICROPHONE END*********************/

    /****************START OF MUTE SPEAKER TEST CODE*******************/
    $('#mute_all').on('click', function() {
        $('body video, body audio').each(function() {
            $(this).prop('muted', true);
        });
    });
    $('#unmute_all').on('click', function() {
        $('body video, body audio').each(function() {
            $(this).prop('muted', false);
        });

    });
    /****************END OF MUTE SPEAKER TEST CODE*******************/
    
    function redirectToRoom() {
        setInterval(function () {
            //Goto room preparation
            window.location.href = 'room-preparation.php?slp=' + appointment_id + '';
        }, 5000);
    }

    /**************INTERNET SPEED TEST *******************/
    var s = new Speedtest(); //create speedtest object
    s.onupdate=function(data){ //callback to update data in UI
        I("ip").textContent=data.clientIp;
        I("dlText").textContent=(data.testState==1&&data.dlStatus==0)?"...":data.dlStatus;
        I("ulText").textContent=(data.testState==3&&data.ulStatus==0)?"...":data.ulStatus;
        I("pingText").textContent=data.pingStatus;
        I("jitText").textContent=data.jitterStatus;
        var prog = (Number(data.dlProgress)*2+Number(data.ulProgress)*2+Number(data.pingProgress))/5;
        I("progress").style.width=(100*prog)+"%";
    }
    s.onend = function(aborted){ //callback for test ended/aborted
        I("testInternet").className=""; //show start button again
        if(aborted){ //if the test was aborted, clear the UI and prepare for new test
            initUI();
        }
    }

    function testInternetConnection(){ //start/stop button pressed
        if(s.getState() == 3){
            s.abort();
        }else{
            s.start();
            I("testInternet").className = "running";
        }
    }
    //function to (re)initialize UI
    function initUI(){
        I("dlText").textContent="";
        I("ulText").textContent="";
        I("pingText").textContent="";
        I("jitText").textContent="";
        I("ip").textContent="";
    }

    function I(id){
        return document.getElementById(id);
    }
})