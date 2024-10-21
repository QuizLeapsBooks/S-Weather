function getWeather() {
    const apiKey = 'ca263374c2f5c62bc3d9fde7eff3ac4d'; // Replace with your own OpenWeatherMap API key
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return;
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch current weather
    fetch(currentWeatherUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
        })
        .catch(error => {
            console.error('Error fetching current weather data:', error);
            alert('Error fetching current weather data. Please try again.');
        });

    // Fetch 5-day forecast
    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayHourlyForecast(data.list);
        })
        .catch(error => {
            console.error('Error fetching hourly forecast data:', error);
            alert('Error fetching hourly forecast data. Please try again.');
        });
}

function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');

    // Clear previous content
    tempDivInfo.innerHTML = '';
    weatherInfoDiv.innerHTML = '';
    weatherIcon.style.display = 'none';

    if (data.cod === '404') {
        weatherInfoDiv.innerHTML = `<p>${data.message}</p>`;
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHtml = `<p>${cityName}</p><p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHtml;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;
        weatherIcon.style.display = 'block'; // Show the icon

        changeBackground(data); // Change background based on weather condition
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    hourlyForecastDiv.innerHTML = ''; // Clear previous hourly forecast

    const next24Hours = hourlyData.slice(0, 8); // Display next 24 hours (3-hour intervals)

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000); // Convert timestamp to milliseconds
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function changeBackground(weatherData) {
    const body = document.body;
    const weatherCondition = weatherData.weather[0].main.toLowerCase();
    const isDaytime = weatherData.dt > weatherData.sys.sunrise && weatherData.dt < weatherData.sys.sunset;

    let backgroundImage = '';

    // Change background based on weather condition and time of day
    if (weatherCondition.includes('rain')) {
        backgroundImage = isDaytime ? 'url("./pexels-pixabay-459451.jpg")' : 'url("./rainy_night.jpg")';
    } else if (weatherCondition.includes('clear')) {
        backgroundImage = isDaytime ? 'url("./blue-sky-cloud-clearing-day-600nw-763628821.jpg")' : 'url("./360_F_811711400_rQi5V5IHBt3dPcU0rDKXGE7wjwiWriZm.jpg")';
    } else if (weatherCondition.includes('clouds')) {
        backgroundImage = isDaytime ? 'url("./istockphoto-912014918-612x612.jpg")' : 'url("./pexels-seatizen-co-170969-557782.jpg")';
    } else {
        backgroundImage = isDaytime ? 'url("https://images.unsplash.com/photo-1508717334315-37b159f24d04?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRheWxpZ2h0fGVufDB8fDB8fHww")' : 'url("https://images.pexels.com/photos/355887/pexels-photo-355887.jpeg")';
    }

    body.style.backgroundImage = backgroundImage;
}
