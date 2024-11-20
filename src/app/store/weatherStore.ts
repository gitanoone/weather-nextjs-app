import { makeAutoObservable } from "mobx";
import { fetchWeatherData, fetchWeatherByCoordinates, fetchCitySuggestions } from "../services/weatherService";
import { transformWeatherData } from "../utils/weatherUtils";
import { City, CurrentWeather } from "../types/weatherTypes";

class WeatherStore {
  city: City | null = null;
  lastSearchedCity: City | null = null;
  weatherData: CurrentWeather | null = null;
  options: City[] = [];
  loadingSuggestions = false;
  isRequestingLocation = false;
  lastLocation: { latitude: number, longitude: number } | null = null;
  isLoading = false;
  weatherSource: "search" | "location" | null = null;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setLastSearchedCity(city: City | null) {
    this.lastSearchedCity = city;
  }
  
  setWeatherData(data: any) {
    this.weatherData = transformWeatherData(data);
    this.isLoading = false;
  }

  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
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

  async fetchWeather(city: string) {
    this.clearError();
    this.setLoading(true);
    this.weatherSource = "search";
    try {
      const data = await fetchWeatherData(city);
      this.setWeatherData(data);
    } catch (error) {
      this.setError((error as Error).message || "An unknown error occurred");
    } finally {
      this.setLoading(false);
    }
  }

  async fetchWeatherByLocation(latitude: number, longitude: number) {
    if (this.lastLocation && this.weatherSource === "location") return;
    this.setLoading(true);
    this.isRequestingLocation = true;
    this.weatherSource = "location";
    try {
      const data = await fetchWeatherByCoordinates(latitude, longitude);
      this.setWeatherData(data);
      this.lastLocation = { latitude , longitude };
    } catch (error) {
      this.setError((error as Error).message || "An unknown error occurred");
    } finally {
      this.isRequestingLocation = false;
      this.setLoading(false);
    }
  }

  async fetchCitySuggestions(query: string) {
    if (query.length < 3) return;

    this.setLoadingSuggestions(true);

    try {
      const data = await fetchCitySuggestions(query);
      const cityNames = data.list.map((city: any) => ({
        id: city.id,
        name: city.name,
        country: city.sys.country,
      }));
      this.options = cityNames;
    } catch {
      this.options = [];
    } finally {
      this.setLoadingSuggestions(false);
    }
  }
}

const weatherStore = new WeatherStore();
export default weatherStore;
