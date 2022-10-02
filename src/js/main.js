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


//TODO display weather + refact
const header = document.querySelector(".card__header-location");
const searchInputData = document.getElementById("search");
const searchForm = document.getElementById("search-form");
let convertedTemperature;
const weatherStatusElement = document.querySelector(".status");
/* const weatherDescriptionElement = document.querySelector(".weather__description"); */
const weatherWindElement = document.querySelector(".weather__wind");

const humidityElement = document.getElementById("humidity");
const iconElement = document.getElementById("icon");
const currentHeading = document.querySelector(".heading");

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
    coord: {
      lon: longitude,
      lat: latitude
    },
  } = response.data;


  convertedTemperature = Math.round(temperature);
  //display
  header.textContent = cityName;
  currentHeading.textContent = formatDate();
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
};

//TODO refact unit conversion
let temperatureElement = document.getElementById("temperature");
let celsius = document.getElementById("celsius");
let fahrenheit = document.getElementById("fahrenheit");

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
const currentLocationBtn = document.getElementById("localisation-btn");

currentLocationBtn.addEventListener("click", event => {
  event.preventDefault();
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

    search(searchInputData.value);
  });
};

formHandler(searchForm);

search("Miami");