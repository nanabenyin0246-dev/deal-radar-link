import { useQuery } from "@tanstack/react-query";

interface WeatherData {
  temperature: number;
  description: string;
  icon: string;
  windSpeed: number;
  humidity: number;
}

const OPEN_METEO_API = "https://api.open-meteo.com/v1/forecast";

const weatherCodeToInfo = (code: number): { description: string; icon: string } => {
  const map: Record<number, { description: string; icon: string }> = {
    0: { description: "Clear sky", icon: "☀️" },
    1: { description: "Mainly clear", icon: "🌤️" },
    2: { description: "Partly cloudy", icon: "⛅" },
    3: { description: "Overcast", icon: "☁️" },
    45: { description: "Foggy", icon: "🌫️" },
    48: { description: "Rime fog", icon: "🌫️" },
    51: { description: "Light drizzle", icon: "🌦️" },
    53: { description: "Moderate drizzle", icon: "🌦️" },
    55: { description: "Dense drizzle", icon: "🌧️" },
    61: { description: "Slight rain", icon: "🌧️" },
    63: { description: "Moderate rain", icon: "🌧️" },
    65: { description: "Heavy rain", icon: "🌧️" },
    71: { description: "Slight snow", icon: "🌨️" },
    73: { description: "Moderate snow", icon: "🌨️" },
    75: { description: "Heavy snow", icon: "❄️" },
    80: { description: "Rain showers", icon: "🌦️" },
    81: { description: "Moderate showers", icon: "🌧️" },
    82: { description: "Violent showers", icon: "⛈️" },
    95: { description: "Thunderstorm", icon: "⛈️" },
    96: { description: "Thunderstorm with hail", icon: "⛈️" },
    99: { description: "Severe thunderstorm", icon: "⛈️" },
  };
  return map[code] || { description: "Unknown", icon: "🌡️" };
};

export const useWeather = (lat?: number, lon?: number) => {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async (): Promise<WeatherData> => {
      const res = await fetch(
        `${OPEN_METEO_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m`
      );
      if (!res.ok) throw new Error("Weather fetch failed");
      const data = await res.json();
      const current = data.current;
      const { description, icon } = weatherCodeToInfo(current.weather_code);

      return {
        temperature: Math.round(current.temperature_2m),
        description,
        icon,
        windSpeed: current.wind_speed_10m,
        humidity: current.relative_humidity_2m,
      };
    },
    enabled: !!lat && !!lon,
    staleTime: 30 * 60 * 1000, // 30 min
  });
};
