import { RawWeatherData }  from "../types/weatherTypes";

export function transformWeatherData(rawData: RawWeatherData) {
    const tempCelsius = Math.round(rawData.main.temp - 273.15);
    return {
      city: rawData.name,
      country: rawData.sys.country,
      temperature: tempCelsius,
      humidity: rawData.main.humidity,
      pressure: rawData.main.pressure,
      windSpeed: rawData.wind.speed,
      description: rawData.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${rawData.weather[0].icon}.png`,
    };
  }
  