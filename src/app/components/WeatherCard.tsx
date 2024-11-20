import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { WeatherCardProps } from '../types/weatherTypes';
import Image from 'next/image';

const getErrorMessage = (error: string | Error | null): string => {
  if (!error) return '';
  return error instanceof Error ? error.message : error;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isLoadingWeather, error }) => {
  if (isLoadingWeather) {
    return (
      <Card sx={{ marginTop: 2, padding: 2, minHeight: 300 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 150 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ marginTop: 2, padding: 2, minHeight: 300 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography color="error">{getErrorMessage(error)}</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card sx={{ marginTop: 2, padding: 2, minHeight: 300 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography>No weather data available. Please search for a city or enable location access.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const { name, country, temperature, humidity, pressure, windSpeed, description, icon } = data;
  const tempCelsius = Math.round(temperature);
  const temperatureColor = tempCelsius > 25 ? 'orange' : tempCelsius < 10 ? 'blue' : 'black';

  return (
    <Card sx={{ marginTop: 2, padding: 2, minHeight: 300 }}>
      <CardContent>
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 1 }}>
          Current Weather
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
          <Image
            src={icon}
            alt={description}
            width={50}
            height={50}
          />
        </Box>

        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 1 }}>
          {description}
        </Typography>

        <Typography variant="body1">City: {name}</Typography>
        <Typography variant="body1">Country: {country}</Typography>
        <Typography variant="body1" sx={{ color: temperatureColor }}>
          Temperature: {tempCelsius}°C
        </Typography>
        <Typography variant="body1">Humidity: {humidity}%</Typography>
        <Typography variant="body1">Pressure: {pressure} hPa</Typography>
        <Typography variant="body1">Wind Speed: {windSpeed} m/s</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
