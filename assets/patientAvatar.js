
    function countdown( elementName, minutes, seconds ){
        var element, endTime, hours, mins, msLeft, time;
        function twoDigits( n ){
            return (n <= 9 ? "0" + n : n);
        }
        function updateTimer(){
            msLeft = endTime - (+new Date);
            if ( msLeft < 0 ) {
                $('#callback').modal('show');
            } else {
                time = new Date( msLeft );
                hours = time.getUTCHours();
                mins = time.getUTCMinutes();
                element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
                setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
            }
        }
        element = document.getElementById( elementName );
        endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
        updateTimer();
    }
    
    (function(w, d){
        function LetterAvatar (name, size) {
            name  = name || '';
            size  = size || 120;
            var colours = [
                "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", 
                "#f1c40f", "#e67e22", "#e74c3c", "#ec97864", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
            ],
                nameSplit = String(name).toUpperCase().split(' '),
                initials, charIndex, colourIndex, canvas, context, dataURI;
            if (nameSplit.length == 1) {
                initials = nameSplit[0] ? nameSplit[0].charAt(0):'?';
            } else {
                initials = nameSplit[0].charAt(0) + nameSplit[1].charAt(0);
            }
            if (w.devicePixelRatio) {
                size = (size * w.devicePixelRatio);
            }
            
            charIndex     = (initials == '?' ? 72 : initials.charCodeAt(0)) - 64;
            colourIndex   = charIndex % 20;
            canvas        = d.createElement('canvas');
            canvas.width  = size;
            canvas.height = size;
            context       = canvas.getContext("2d");
             
            context.fillStyle = colours[colourIndex - 1];
            context.fillRect (0, 0, canvas.width, canvas.height);
            context.font = Math.round(canvas.width/2)+"px Segoe UI";
            context.textAlign = "center";
            context.fillStyle = "#fff";
            context.fillText(initials, size / 2, size / 1.5);

            dataURI = canvas.toDataURL();
            canvas  = null;

            return dataURI;
        }

        LetterAvatar.transform = function() {
            Array.prototype.forEach.call(d.querySelectorAll('img[avatar]'), function(img, name) {
                name = img.getAttribute('avatar');
                img.src = LetterAvatar(name, img.getAttribute('width'));
                img.removeAttribute('avatar');
                img.setAttribute('alt', name);
            });
        };

        // AMD support
        if (typeof define === 'function' && define.amd) {
            define(function () { return LetterAvatar; });
        } else if (typeof exports !== 'undefined') {
            if (typeof module != 'undefined' && module.exports) {
                exports = module.exports = LetterAvatar;
            }
            exports.LetterAvatar = LetterAvatar;
        } else {
            window.LetterAvatar = LetterAvatar;
            d.addEventListener('DOMContentLoaded', function(event) {
                LetterAvatar.transform();
            });
        }

    })(window, document);