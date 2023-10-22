const apiKey = 'a888b92da1bf5623fb9590eed8366463';
const inputvalue = document.querySelector('#city-input');
const btn = document.querySelector('#search-btn');
const cityOutput = document.querySelector('#city-name');
const description = document.querySelector('#weather-description');
const temp = document.querySelector('#temperature');
const favoriteBtn = document.querySelector('#favorite-btn');
const favoriteCitiesList = document.querySelector('#favorite-cities-list');

let favoriteCities = [];

function fetchWeatherForCity(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
        .then((res) => res.json())
        .then((data) => {
            const nameval = data.name;
            const descrip = data.weather[0].description;
            const temperature = (data.main.temp - 273).toFixed(3);

            cityOutput.innerHTML = `Weather in ${nameval}`;
            description.innerHTML = `Description: ${descrip}`;
            temp.innerHTML = `Temperature: ${temperature}°C`;

            favoriteBtn.disabled = false;
            if (favoriteCities.includes(nameval)) {
                favoriteBtn.textContent = 'Remove from Favorites';
            } else if (favoriteCities.length >= 3) {
                favoriteBtn.textContent = 'Add to Favorites';
                favoriteBtn.disabled = true;
            } else {
                favoriteBtn.textContent = 'Add to Favorites';
            }
        })
        .catch((err) => {
            alert('City not found or there was an issue fetching data.');
            console.error('Error:', err);
        });
}

favoriteCitiesList.addEventListener('click', function (e) {
    if (e.target && e.target.nodeName === 'LI') {
        const cityName = e.target.textContent;
        inputvalue.value = cityName;
        fetchWeatherForCity(cityName);
    }
});

btn.addEventListener('click', function () {
    fetchWeatherForCity(inputvalue.value);
});

favoriteBtn.addEventListener('click', function () {
    const cityName = cityOutput.innerText.split(' ')[2];
    toggleFavorite(cityName);
});

function toggleFavorite(cityName) {
    if (!favoriteCities.includes(cityName)) {
        favoriteCities.push(cityName);
    } else {
        const index = favoriteCities.indexOf(cityName);
        favoriteCities.splice(index, 1);
    }
    inputvalue.value = cityName;
    updateFavoritesList();
    updateFavoriteButtonState();
}

function updateFavoritesList() {
    favoriteCitiesList.innerHTML = '';
    favoriteCities.forEach(function (city) {
        const listItem = document.createElement('li');
        listItem.textContent = city;
        favoriteCitiesList.appendChild(listItem);
    });
}

function updateFavoriteButtonState() {
    const cityName = cityOutput.innerText.split(' ')[2];
    if (favoriteCities.includes(cityName)) {
        favoriteBtn.textContent = 'Remove from Favorites';
    } else {
        favoriteBtn.textContent = 'Add to Favorites';
    }
    favoriteBtn.disabled = favoriteCities.length >= 3 && !favoriteCities.includes(cityName);
}

