import { fetchWithAuth } from "../utils/authUtils";
import { makeAutoObservable } from "mobx";
import { City, RawWeatherData, CityFromAPI, CurrentWeather } from "../types/weatherTypes";

class WeatherStore {
  city: City | null = null;
  lastSearchedCity: City | null = null;
  weatherData: CurrentWeather | null = null;
  options: City[] = [];
  loadingSuggestions = false;
  isLoadingWeather = false;
  isRequestingLocation = false;
  lastLocation: { latitude: number; longitude: number } | null = null;
  weatherSource: "search" | "location" | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLastSearchedCity(city: City | null) {
    this.lastSearchedCity = city;
  }

  setWeatherData(data: RawWeatherData) {
    this.weatherData = {
      name: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp - 273.15),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    };
    this.setLoadingWeather(false);
  }

  setLoadingWeather(isLoading: boolean) {
    this.isLoadingWeather = isLoading;
  }

  setLoadingSuggestions(isLoading: boolean) {
    this.loadingSuggestions = isLoading;
  }

  setError(error: string | null) {
    this.error = error;
  }

  clearSuggestions() {
    this.options = [];
  }

  clearError() {
    this.error = null;
  }

  setLastLocation(latitude: number, longitude: number) {
    this.lastLocation = { latitude, longitude };
    this.weatherSource = 'location';
  }

  resetLastLocation() {
    this.lastLocation = null;
  }

  resetWeatherSource() {
    this.weatherSource = 'search';
  }

  setIsRequestingLocation(isRequesting: boolean) {
    this.isRequestingLocation = isRequesting;
  }

  handleError(error: unknown, defaultMessage: string) {
    if (error instanceof Error) {
      this.setError(error.message || defaultMessage);
    } else {
      this.setError(defaultMessage);
    }
  }

  async fetchData(url: string, isCitySuggestions: boolean = false) {
    try {
      const response = await fetchWithAuth(url);

      if (!response) {
        throw new Error('No response received from the server.');
      }

      if (isCitySuggestions) {
        const data: CityFromAPI[] = await response.json();
        this.options = data.map((city: CityFromAPI) => ({
          id: city.id,
          name: city.name,
          country: city.country,
        }));
      } else {
        const data: RawWeatherData = await response.json();
        this.setWeatherData(data);
      }
    } catch (error: unknown) {
      this.handleError(error, 'An error occurred while fetching data');
    } finally {
      if (!isCitySuggestions) {
        this.setLoadingWeather(false);
      }
    }
  }

  async fetchWeatherByLocation(latitude: number, longitude: number) {
    if (this.lastLocation && this.lastLocation.latitude === latitude && this.lastLocation.longitude === longitude) {
      return;
    }

    this.setIsRequestingLocation(true);

    this.setLastLocation(latitude, longitude);
    const url = `/api/weather?latitude=${latitude}&longitude=${longitude}`;
    await this.fetchData(url);
    this.setLastSearchedCity(null);
    this.setIsRequestingLocation(false);
    this.setLoadingWeather(false);
  }

  async fetchWeather(city: string) {
    this.resetWeatherSource();
    this.resetLastLocation();
    const url = `/api/weather?city=${city}`;
    await this.fetchData(url);
  }

  async fetchCitySuggestions(query: string) {
    if (query.length < 3) {
      this.clearSuggestions();
      return;
    }

    this.setLoadingSuggestions(true);

    try {
      const url = `/api/weather?query=${query}`;
      await this.fetchData(url, true);
    } catch (error: unknown) {
      this.clearSuggestions();
      this.handleError(error, 'An error occurred while fetching city suggestions');
    } finally {
      this.setLoadingSuggestions(false);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
