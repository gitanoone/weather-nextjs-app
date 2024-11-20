import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { CurrentWeather } from '../types/weatherTypes';
import Image from 'next/image';


interface WeatherCardProps {
  data?: CurrentWeather | null;
  isLoading: boolean;
  error: string | Error | null;
}

const getErrorMessage = (error: string | Error | null): string => {
  if (!error) return '';
  return error instanceof Error ? error.message : error;
};

const WeatherCard: React.FC<WeatherCardProps> = ({ data, isLoading, error }) => {
  if (isLoading) {
    return (
      <Card sx={{ marginTop: 2, padding: 2 }}>
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
      <Card sx={{ marginTop: 2, padding: 2 }}>
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
      <Card sx={{ marginTop: 2, padding: 2 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', marginTop: 3 }}>
            <Typography>No weather data available. Please search for a city or enable location access.</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const tempCelsius = Math.round(data.temperature);
  const temperatureColor = tempCelsius > 25 ? 'orange' : tempCelsius < 10 ? 'blue' : 'black';

  return (
    <Card sx={{ marginTop: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: 1 }}>
          Current Weather
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 1 }}>
          <Image
            src={data.icon}
            alt={data.description}
            width={50}
            height={50}
          />
        </Box>

        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: 1 }}>
          {data.description}
        </Typography>

        <Typography variant="body1">City: {data.city}</Typography>
        <Typography variant="body1">Country: {data.country}</Typography>
        <Typography variant="body1" sx={{ color: temperatureColor }}>
          Temperature: {tempCelsius}°C
        </Typography>
        <Typography variant="body1">Humidity: {data.humidity}%</Typography>
        <Typography variant="body1">Pressure: {data.pressure} hPa</Typography>
        <Typography variant="body1">Wind Speed: {data.windSpeed} m/s</Typography>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
