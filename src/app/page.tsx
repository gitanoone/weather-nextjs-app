"use client";

import React, { useEffect } from 'react';
import { Box, Typography, Button, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import CitySearch from './components/CitySearch';
import WeatherCard from './components/WeatherCard';
import themeStore from './store/themeStore';
import useAuth from './hooks/useAuth';

const HomePage = observer(() => {
  useEffect(() => {
    themeStore.initTheme();
  }, []);

  useAuth();
  
  const theme = createTheme({
    palette: {
      mode: themeStore.themeMode,
      primary: { main: '#1976d2' },
      background: {
        default: themeStore.themeMode === 'light' ? '#f5f5f5' : '#303030',
      },
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
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
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
            color: theme.palette.primary.main,
            fontWeight: 600,
          }}
        >
          Weather App
        </Typography>

        <CitySearch />
        <WeatherCard />

        <Button
          variant="contained"
          onClick={() => themeStore.toggleTheme()}
          sx={{
            marginTop: 3,
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
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
