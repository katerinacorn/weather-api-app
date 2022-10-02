import {
  KEY,
  BASE_URL
} from "./constants";

//local Date
const formatDate = () => {
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const day = days[date.getDay()];
  const hours = (date.getHours() < 10 ? "0" : "") + date.getHours();
  const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  return `${day}, ${hours}:${minutes}`;
};

const formatDay = (timestamp) => {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

//get API data
const axios = require("axios").default;
let units = "metric";

const search = (city) => {
  const apiUrl = `${BASE_URL}/weather?q=${city}&appid=${KEY}&units=${units}`;
  axios.get(apiUrl).then(showCityWheather);
};

//current location
let latitude;
let longitude;
const setCoordinates = (position) => {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
};

const currentPosition = navigator.geolocation.getCurrentPosition(
  setCoordinates
);

const getWeatherData = () => {
  const URL = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}&units=${units}`;
  axios.get(URL).then(showCityWheather);
};

const getForecastData = (coordinates) => {
  const URL = `${BASE_URL}/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${KEY}&units=${units}`;
  axios.get(URL).then(displayForecast);
};


//display weather
const header = document.querySelector(".card__header-location");
const searchInputData = document.getElementById("search");
const searchForm = document.getElementById("search-form");
const weatherStatusElement = document.querySelector(".status");
const weatherWindElement = document.querySelector(".weather__wind");
const humidityElement = document.getElementById("humidity");
const iconElement = document.getElementById("icon");
const currentHeading = document.querySelector(".heading");
const temperatureElement = document.getElementById("temperature");
const celsius = document.getElementById("celsius");
const fahrenheit = document.getElementById("fahrenheit");
const currentLocationBtn = document.getElementById("localisation-btn");
const forecastContainer = document.getElementById("forecast");
let convertedTemperature;

const showCityWheather = (response) => {
  const {
    name: cityName,
    weather: [{
      main: weatherTitle,
      description: weatherDescription,
      icon: iconId
    }],
    main: {
      temp: temperature,
      humidity: humidity,
    },
    wind: {
      speed: windSpeed,
    },
    coord: coordinates,
  } = response.data;


  convertedTemperature = Math.round(temperature);
  //display
  header.textContent = formatDate();
  currentHeading.textContent = `${cityName} today:`;

  //*
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${iconId}@2x.png`
  );
  iconElement.setAttribute("alt", weatherDescription);
  weatherStatusElement.textContent = weatherTitle;
  temperatureElement.textContent = `${Math.round(temperature)}`;

  weatherWindElement.textContent = `Wind speed: ${windSpeed} m/sec`;
  humidityElement.textContent = `Humidity: ${humidity} %`;

  getForecastData(coordinates);
};

//unit conversion
celsius.addEventListener("click", event => {
  event.preventDefault();
  let celsiusTemp = Math.round(convertedTemperature);
  temperatureElement.textContent = celsiusTemp;
  celsius.classList.add("active");
  fahrenheit.classList.remove("active");
});

fahrenheit.addEventListener("click", event => {
  event.preventDefault();
  let fahrenheitTemp = Math.round((convertedTemperature * 9) / 5 + 32);
  temperature.textContent = fahrenheitTemp;
  fahrenheit.classList.add("active");
  celsius.classList.remove("active");
});

//local weather
currentLocationBtn.addEventListener("click", event => {
  event.preventDefault();
  while (forecastContainer.firstChild) {
    forecastContainer.removeChild(forecastContainer.firstChild);
  }
  getWeatherData();
});

//form handler
const formHandler = (form) => {
  form.addEventListener('submit', event => {
    event.preventDefault();
    let searchInputData = document.getElementById("search");
    if (!searchInputData.value) {
      alert("Enter a city name, please😊");
      return;
    }
    while (forecastContainer.firstChild) {
      forecastContainer.removeChild(forecastContainer.firstChild);
    }

    search(searchInputData.value);

  });
};

//forecast
const displayForecast = (response) => {
  const forecast = response.data.daily;

  forecast.forEach((day, index) => {
    const forecastElement = document.createElement("div");
    forecastElement.setAttribute("class", "day");

    if (index < 6) {
      forecastElement.innerHTML = `
      <p class="day__title">${formatDay(day.dt)}</p>
      <img class="day__icon" src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png"
      alt="${day.weather[0].description}"/>
    <p class="status">
    ${day.weather[0].main}
    </p>
    <p class="day-details">
      <span class="day-details_max">
      ${Math.round(
        day.temp.max)}º
      </span>
      <span class="day-details_min">
      ${Math.round(
        day.temp.min)}º
      </span>
    </p>
    `;

      forecastContainer.appendChild(forecastElement);
    }
  });
};

formHandler(searchForm);

search("Miami");