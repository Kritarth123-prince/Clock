function updateTime() {
    fetch('https://worldtimeapi.org/api/ip')
        .then(response => response.json())
        .then(data => {
            const serverTime = new Date(data.datetime);
            const now = new Date();
            const deltaTime = now - serverTime;
            const correctedTime = new Date(now - deltaTime);
            const hours = String(correctedTime.getHours()).padStart(2, '0');
            const minutes = String(correctedTime.getMinutes()).padStart(2, '0');
            const seconds = String(correctedTime.getSeconds()).padStart(2, '0');
            const day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][correctedTime.getDay()];
            const date = String(correctedTime.getDate()).padStart(2, '0');
            const month = String(correctedTime.getMonth() + 1).padStart(2, '0');
            document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
            document.getElementById('day-date').textContent = `${day} ${date}/${month}`;
        })
        .catch(error => {
            console.error('Error fetching time:', error);
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const day = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][now.getDay()];
            const date = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
            document.getElementById('day-date').textContent = `${day} ${date}/${month}`;
        });
}


function updateTemperature(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=08c7a7fa838732dbc0e72b99cfbcbe8e&units=metric`)
        .then(response => response.json())
        .then(data => {
            const temperature = data.main.temp;
            document.getElementById('temperature').textContent = `Temperature: ${temperature}°C`;
        })
        .catch(error => {
            console.error('Error fetching temperature:', error);
            document.getElementById('temperature').textContent = 'Unable to fetch temperature';
        });
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            updateTemperature(latitude, longitude);
        }, error => {
            console.error('Error getting location:', error);
            document.getElementById('temperature').textContent = 'Unable to retrieve location';
            setTimeout(getLocation, 5000);
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
        document.getElementById('temperature').textContent = 'Geolocation is not supported';
    }
}


function toggleFullScreen() {
    if (!document.fullscreenElement &&  
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}

document.getElementById('fullscreen-button').addEventListener('click', toggleFullScreen);


setInterval(updateTime, 1000);
getLocation();
