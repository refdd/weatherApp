import React, { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
import axios from "axios";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import { Button } from "@mui/material";

const API_KEY = "YOUR_OPEN_METEO_API_KEY";

const theme = createTheme({
  palette: {
    mode: "light", // Set initial mode to light
    background: {
      default: "#ffffff", // Light mode background color
    },
    text: {
      primary: "#000000", // Light mode text color
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Set mode to dark
    background: {
      default: "#303030", // Dark mode background color
    },
    text: {
      primary: "#ffffff", // Dark mode text color
    },
  },
});

const WeatherDetails = ({ weatherData, darkMode }) => {
  return (
    <Card sx={{ background: darkMode ? "#1976d27d" : "#fff" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Weather Details
        </Typography>
        {weatherData.hourly.temperature_2m.map((temp, index) => (
          <Typography variant="body1" key={index}>
            Time: {weatherData.hourly.time[index]}, Temperature: {temp}°C
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
};

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [openWeather, setopenWeather] = useState(false);
  const currentTheme = darkMode ? darkTheme : theme;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,snow_depth`
        );
        setWeatherData(response.data);
      } catch (error) {
        console.log("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color={darkMode ? "default" : "primary"}>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            Weather App
          </Typography>
          <Switch checked={darkMode} onChange={handleDarkModeToggle} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
        {weatherData && (
          <>
            <Card sx={{ background: darkMode ? "#1976d27d" : "#fff" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Current Weather
                </Typography>
                {/* <Link to="/weather-details">View Details</Link> */}
                <Typography variant="body1">
                  Location: {weatherData.timezone}
                </Typography>
                <Typography variant="body1">
                  Temperature: {weatherData.hourly.temperature_2m[0]}°C
                </Typography>
                <Typography variant="body1">
                  Snow Depth: {weatherData.hourly.snow_depth[0]} cm
                </Typography>
                <Button
                  onClick={() => {
                    setopenWeather(!openWeather);
                  }}
                  variant="contained"
                >
                  current weather
                </Button>
              </CardContent>
            </Card>
            {openWeather && (
              <WeatherDetails weatherData={weatherData} darkMode={darkMode} />
            )}
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default App;
