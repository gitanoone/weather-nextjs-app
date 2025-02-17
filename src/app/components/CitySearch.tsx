import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { TextField, Autocomplete, Box, CircularProgress } from "@mui/material";
import weatherStore from "../store/weatherStore";
import LocationButton from "./LocationButton";
import { useDebouncedCallback } from "../hooks/useDebouncedCallback";
import { City } from "../types/weatherTypes";

const CitySearch: React.FC = observer(() => {
  const { city, lastSearchedCity, options, loadingSuggestions } = weatherStore;

  const debouncedFetchCitySuggestions = useDebouncedCallback(
    (query: string) => weatherStore.fetchCitySuggestions(query),
    500
  );

  const handleInputChange = (event: React.SyntheticEvent, newInputValue: string) => {
    if (newInputValue.length >= 3) {
      debouncedFetchCitySuggestions(newInputValue);
    }
  };

  const handleSelectCity = useCallback(
    (event: React.SyntheticEvent, selectedCity: City | null) => {
      if (selectedCity) {
        if (
          !lastSearchedCity ||
          selectedCity.name !== lastSearchedCity.name ||
          selectedCity.country !== lastSearchedCity.country
        ) {
          weatherStore.fetchWeather(`${selectedCity.name},${selectedCity.country}`);
          weatherStore.setLastSearchedCity(selectedCity);
        }
        weatherStore.clearSuggestions();
      }
    },
    [lastSearchedCity]
  );

  const getOptionLabel = useCallback((option: City) => `${option.name}, ${option.country}`, []);

  useEffect(() => {
    if (lastSearchedCity) {
      weatherStore.fetchWeather(`${lastSearchedCity.name},${lastSearchedCity.country}`);
    }
  }, [lastSearchedCity]);

  return (
    <Box>
      <Autocomplete
        options={options}
        loading={loadingSuggestions}
        onInputChange={handleInputChange}
        value={city}
        onChange={handleSelectCity}
        getOptionLabel={getOptionLabel}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}, {option.country}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Enter city"
            variant="outlined"
            fullWidth
            placeholder="e.g. Paris, New York, Tokyo"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingSuggestions ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      <LocationButton />
    </Box>
  );
});

export default CitySearch;
