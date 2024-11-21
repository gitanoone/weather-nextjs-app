import React from 'react';
import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import weatherStore from '../store/weatherStore';

const LocationButton: React.FC = observer(() => {
  const handleGeolocationError = (error: GeolocationPositionError) => {
    const errorMessages : Record<number, string> = {
      [error.PERMISSION_DENIED]: 'Permission denied. Please enable location access.',
      [error.POSITION_UNAVAILABLE]: 'Location unavailable. Try again later.',
      [error.TIMEOUT]: 'Location request timed out.',
    };
    weatherStore.setError(errorMessages[error.code] || 'Failed to fetch location.');
  };

  const fetchWeatherByLocation = async () => {
    if (weatherStore.isRequestingLocation || !navigator.geolocation) {
      weatherStore.setError(
        !navigator.geolocation
          ? 'Geolocation is not supported by your browser.'
          : 'A location request is already in progress.'
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        weatherStore.setLoadingWeather(true);
        const hasLocationChanged =
          !weatherStore.lastLocation ||
          weatherStore.lastLocation.latitude !== latitude ||
          weatherStore.lastLocation.longitude !== longitude;

        if (!hasLocationChanged) {
          console.log("Location hasn't changed, skipping weather request.");
          return;
        }

        try {
          await weatherStore.fetchWeatherByLocation(latitude, longitude);
          weatherStore.setLastLocation(latitude, longitude);
          weatherStore.clearSuggestions();
        } catch {
          weatherStore.setError('Failed to fetch weather data for your location.');
        } finally {
          weatherStore.setLoadingWeather(false);
        }
      },
      handleGeolocationError
    );
  };

  const getButtonText = () => {
    if (weatherStore.isRequestingLocation) return 'Fetching Location...';
    if (weatherStore.weatherSource === 'location') return 'Weather Loaded by Location';
    return 'Use My Location';
  };

  return (
    <Button
      variant="outlined"
      onClick={fetchWeatherByLocation}
      disabled={weatherStore.isRequestingLocation || weatherStore.weatherSource === 'location'}
      aria-busy={weatherStore.isRequestingLocation}
      sx={{
        width: '100%',
        marginTop: 2,
        borderRadius: 1,
        padding: 1.5,
        fontSize: 16,
      }}
    >
      {getButtonText()}
    </Button>
  );
});

export default LocationButton;
