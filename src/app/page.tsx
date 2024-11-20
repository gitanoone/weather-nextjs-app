"use client";

import React, { useEffect } from 'react';
import { Box, Typography, Button, useMediaQuery, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import CitySearch from './components/CitySearch';
import WeatherCard from './components/WeatherCard';
import weatherStore from './store/weatherStore';
import themeStore from './store/themeStore';
import useAuth from './hooks/useAuth';

const HomePage = observer(() => {
  useAuth();

  const { weatherData, isLoadingWeather, error } = weatherStore;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    themeStore.setThemeMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = createTheme({
    palette: {
      mode: themeStore.themeMode,
      primary: {
        main: '#1976d2',
      },
      background: {
        default: themeStore.themeMode === 'light' ? '#f5f5f5' : '#303030',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box
        sx={{
          padding: 3,
          maxWidth: 600,
          margin: 'auto',
          backgroundColor: 'background.default',
          borderRadius: 2,
          boxShadow: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{
            marginBottom: 3,
            color: themeStore.themeMode === 'light' ? '#1976d2' : '#fff',
            fontWeight: 600,
          }}
        >
          Weather App
        </Typography>

        <CitySearch />
        <WeatherCard
          data={!isLoadingWeather ? weatherData : null}
          isLoadingWeather={isLoadingWeather}
          error={error}
        />

        <Button
          variant="contained"
          onClick={() => themeStore.toggleTheme()}
          sx={{
            marginTop: 3,
            backgroundColor: themeStore.themeMode === 'light' ? '#1976d2' : '#424242',
            color: '#fff',
            '&:hover': {
              backgroundColor: themeStore.themeMode === 'light' ? '#1565c0' : '#616161',
            },
          }}
        >
          {themeStore.themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        </Button>
      </Box>
    </ThemeProvider>
  );
});

export default HomePage;
