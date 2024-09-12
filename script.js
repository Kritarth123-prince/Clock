const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;
let isDarkMode = false;

body.classList.add('light-mode');

themeToggleButton.addEventListener('click', () => {
    if (isDarkMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }

    isDarkMode = !isDarkMode;
});

const fullscreenButton = document.getElementById('fullscreen-button');
const exitFullscreenButton = document.getElementById('exit-fullscreen-button');

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            fullscreenButton.style.display = 'none';
            exitFullscreenButton.style.display = 'block';
        });
    } else {
        document.exitFullscreen().then(() => {
            fullscreenButton.style.display = 'block';
            exitFullscreenButton.style.display = 'none';
        });
    }
}

fullscreenButton.addEventListener('click', toggleFullScreen);
exitFullscreenButton.addEventListener('click', toggleFullScreen);

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenButton.style.display = 'block';
        exitFullscreenButton.style.display = 'none';
    }
});

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
        });
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
}

setInterval(updateTime, 1000);
getLocation();
