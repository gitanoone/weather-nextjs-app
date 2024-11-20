import React, { useCallback } from 'react';
import { Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import weatherStore from '../store/weatherStore';

const LocationButton: React.FC = observer(() => {
  const fetchWeatherByLocation = useCallback(async () => {
    if (weatherStore.isRequestingLocation) return;

    if (!navigator.geolocation) {
      weatherStore.setError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await weatherStore.fetchWeatherByLocation(latitude, longitude);
          weatherStore.clearSuggestions();
        } catch {
          weatherStore.setError('Failed to fetch weather data for your location.');
        }
      },
      (error) => {
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission denied. Please enable location access.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location unavailable. Try again later.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'Failed to fetch location.';
        }
        weatherStore.setError(errorMessage);
      }
    );
  }, [weatherStore.isRequestingLocation, weatherStore.weatherSource]);

  const buttonText = (() => {
    if (weatherStore.isRequestingLocation) return 'Fetching Location...';
    if (weatherStore.weatherSource === 'location') return 'Weather Loaded by Location';
    return 'Use My Location';
  })();

  return (
    <Button
      variant="outlined"
      onClick={fetchWeatherByLocation}
      disabled={weatherStore.isRequestingLocation}
      aria-busy={weatherStore.isRequestingLocation}
      sx={{
        width: '100%',
        marginTop: 2,
        borderRadius: 1,
        padding: 1.5,
        fontSize: 16,
      }}
    >
      {buttonText}
    </Button>
  );
});

export default LocationButton;
