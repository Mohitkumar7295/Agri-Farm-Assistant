export interface FarmWeatherData {
  latitude: number;
  longitude: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  weatherCondition: string;
  maxTemperature: number;
  minTemperature: number;
  precipitation: number;
  timestamp?: string;
}

export function getWeatherDescription(code: number, lang: "en" | "hi" = "en"): string {
  if (lang === "hi") {
    switch (code) {
      case 0:
        return "साफ़ आसमान (Clear Sky)";
      case 1:
        return "मुख्य रूप से साफ़ (Mainly Clear)";
      case 2:
        return "आंशिक रूप से बादल (Partly Cloudy)";
      case 3:
        return "घने बादल (Overcast)";
      case 45:
      case 48:
        return "कोहरा (Fog)";
      case 51:
      case 53:
      case 55:
        return "हल्की बूंदाबांदी (Drizzle)";
      case 61:
        return "हल्की बारिश (Light Rain)";
      case 63:
        return "मध्यम बारिश (Moderate Rain)";
      case 65:
        return "भारी बारिश (Heavy Rain)";
      case 71:
      case 73:
      case 75:
        return "बर्फबारी (Snow)";
      case 80:
      case 81:
      case 82:
        return "तेज़ बौछारें (Rain Showers)";
      case 95:
      case 96:
      case 99:
        return "गरज के साथ बारिश (Thunderstorm)";
      default:
        return "आंशिक रूप से बादल (Partly Cloudy)";
    }
  }

  switch (code) {
    case 0:
      return "Clear sky";
    case 1:
      return "Mainly clear";
    case 2:
      return "Partly cloudy";
    case 3:
      return "Overcast";
    case 45:
      return "Fog";
    case 48:
      return "Depositing rime fog";
    case 51:
      return "Light drizzle";
    case 53:
      return "Moderate drizzle";
    case 55:
      return "Dense drizzle";
    case 56:
    case 57:
      return "Freezing drizzle";
    case 61:
      return "Slight rain";
    case 63:
      return "Moderate rain";
    case 65:
      return "Heavy rain";
    case 66:
    case 67:
      return "Freezing rain";
    case 71:
      return "Slight snow fall";
    case 73:
      return "Moderate snow fall";
    case 75:
      return "Heavy snow fall";
    case 77:
      return "Snow grains";
    case 80:
      return "Slight rain showers";
    case 81:
      return "Moderate rain showers";
    case 82:
      return "Violent rain showers";
    case 85:
    case 86:
      return "Snow showers";
    case 95:
      return "Thunderstorm";
    case 96:
    case 99:
      return "Thunderstorm with hail";
    default:
      return "Partly cloudy";
  }
}
