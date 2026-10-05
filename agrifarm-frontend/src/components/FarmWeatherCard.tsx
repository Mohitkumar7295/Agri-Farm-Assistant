"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  RefreshCw,
  AlertCircle,
  Loader2,
  ArrowUp,
  ArrowDown,
  Navigation,
} from "lucide-react";
import { FarmWeatherData, getWeatherDescription } from "@/utils/weatherUtils";

interface FarmWeatherCardProps {
  latitude?: number | null;
  longitude?: number | null;
  farmName?: string;
  lang?: "en" | "hi";
  onWeatherLoaded?: (data: FarmWeatherData) => void;
}

export default function FarmWeatherCard({
  latitude,
  longitude,
  farmName,
  lang = "en",
  onWeatherLoaded,
}: FarmWeatherCardProps) {
  const [weather, setWeather] = useState<FarmWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const fetchWeather = useCallback(async (lat: number, lng: number, forceRefresh = false) => {
    const cacheKey = `agrifarm_weather_${lat.toFixed(4)}_${lng.toFixed(4)}`;
    
    // Check client session cache if not forced refresh (15 minute TTL)
    if (!forceRefresh) {
      try {
        const cachedRaw = sessionStorage.getItem(cacheKey);
        if (cachedRaw) {
          const { data, timestamp } = JSON.parse(cachedRaw);
          const ageMinutes = (Date.now() - timestamp) / (1000 * 60);
          if (ageMinutes < 15) {
            setWeather(data);
            setErrorMessage(null);
            setLastRefreshed(new Date(timestamp));
            if (onWeatherLoaded) onWeatherLoaded(data);
            return;
          }
        }
      } catch {
        // Continue to fresh fetch on cache error
      }
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Backend base URL from environment or default
      const backendBase = process.env.NEXT_PUBLIC_API_URL
        ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "")
        : "http://localhost:8080";

      const url = `${backendBase}/api/weather?latitude=${lat}&longitude=${lng}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Weather service returned HTTP ${response.status}`);
      }

      const data: FarmWeatherData = await response.json();
      setWeather(data);
      setLastRefreshed(new Date());

      // Save to sessionStorage
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data,
          timestamp: Date.now(),
        }));
      } catch {
        // Ignore sessionStorage quota error
      }

      if (onWeatherLoaded) {
        onWeatherLoaded(data);
      }
    } catch (err) {
      console.error("Failed to load farm weather:", err);
      setErrorMessage(
        lang === "hi"
          ? "मौसम डेटा लोड करने में असमर्थ। कृपया पुनः प्रयास करें।"
          : "Unable to load weather data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [lang, onWeatherLoaded]);

  useEffect(() => {
    if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      fetchWeather(latitude, longitude);
    }
  }, [latitude, longitude, fetchWeather]);

  const handleManualRefresh = () => {
    if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
      fetchWeather(latitude, longitude, true);
    }
  };

  // State 1: No Location Set
  if (latitude == null || longitude == null || isNaN(latitude) || isNaN(longitude)) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241a]/60 border border-slate-200 dark:border-emerald-800/40 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <CloudSun className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
            {lang === "hi" ? "फार्म का मौसम" : "Farm Weather"}
          </h2>
        </div>
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-center">
          <Navigation className="w-6 h-6 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
          <p className="text-xs sm:text-sm font-semibold text-amber-800 dark:text-amber-300">
            {lang === "hi"
              ? "फार्म का स्थान सेट नहीं है। स्थानीय मौसम देखने हेतु अपना फार्म स्थान जोड़ें।"
              : "Farm location is not set. Add your farm location to view local weather."}
          </p>
          <div className="mt-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0F5132] hover:bg-[#15803d] text-white text-xs font-bold transition-all shadow-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{lang === "hi" ? "फार्म स्थान सेट करें" : "Set Farm Location"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // State 2: Loading State
  if (isLoading && !weather) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241a]/60 border border-slate-200 dark:border-emerald-800/40 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500 animate-pulse" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {lang === "hi" ? "फार्म का मौसम" : "Farm Weather"}
            </h2>
          </div>
        </div>
        <div className="py-8 flex flex-col items-center justify-center gap-2.5 text-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#0F5132] dark:text-emerald-400" />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {lang === "hi" ? "फार्म का मौसम लोड हो रहा है..." : "Loading farm weather..."}
          </p>
        </div>
      </div>
    );
  }

  // State 3: Error State
  if (errorMessage && !weather) {
    return (
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241a]/60 border border-slate-200 dark:border-emerald-800/40 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {lang === "hi" ? "फार्म का मौसम" : "Farm Weather"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleManualRefresh}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-emerald-800/40 hover:bg-slate-50 dark:hover:bg-emerald-950 text-slate-600 dark:text-slate-300 transition-colors"
            title="Retry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/40 text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <p className="text-xs font-medium text-red-700 dark:text-red-300">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  const weatherDescription = weather
    ? getWeatherDescription(weather.weatherCode, lang)
    : "Partly Cloudy";

  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-[#0c241a]/60 border border-slate-200/90 dark:border-emerald-800/40 shadow-xs hover:border-emerald-500/50 transition-all">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {lang === "hi" ? "फार्म का मौसम" : "Farm Weather"}
            </h2>
            {farmName && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {farmName}
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleManualRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-800/40 bg-slate-50 dark:bg-[#071911] text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-400 hover:border-emerald-500/50 transition-all disabled:opacity-60 cursor-pointer shadow-2xs"
          title={lang === "hi" ? "मौसम ताज़ा करें" : "Refresh Weather"}
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
          <span className="hidden sm:inline">
            {lang === "hi" ? "ताज़ा करें" : "Refresh"}
          </span>
        </button>
      </div>

      {weather && (
        <div className="space-y-4">
          {/* PRIMARY TEMPERATURE & CONDITION HERO */}
          <div className="flex items-baseline justify-between p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white dark:from-[#061810] dark:to-[#0c241a]/80 border border-emerald-100 dark:border-emerald-900/40">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                  {weather.temperature != null ? Math.round(weather.temperature) : "--"}
                </span>
                <span className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
                  °C
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-900 dark:text-emerald-300 mt-0.5">
                {weatherDescription}
              </p>
            </div>

            {/* HIGH / LOW PILL */}
            <div className="flex flex-col items-end gap-1 text-xs">
              {weather.maxTemperature != null && (
                <span className="inline-flex items-center gap-1 font-bold text-slate-700 dark:text-slate-200">
                  <ArrowUp className="w-3 h-3 text-red-500" />
                  <span>{lang === "hi" ? "अधिकतम" : "High"}: {Math.round(weather.maxTemperature)}°C</span>
                </span>
              )}
              {weather.minTemperature != null && (
                <span className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300">
                  <ArrowDown className="w-3 h-3 text-blue-500" />
                  <span>{lang === "hi" ? "न्यूनतम" : "Low"}: {Math.round(weather.minTemperature)}°C</span>
                </span>
              )}
            </div>
          </div>

          {/* 3 METRIC TILES: HUMIDITY, WIND, RAINFALL */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Humidity */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071911] border border-slate-200/80 dark:border-emerald-900/40 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" />
                <span>{lang === "hi" ? "नमी" : "Humidity"}</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {weather.humidity != null ? `${weather.humidity}%` : "--"}
              </p>
            </div>

            {/* Wind */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071911] border border-slate-200/80 dark:border-emerald-900/40 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                <span>{lang === "hi" ? "हवा" : "Wind"}</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {weather.windSpeed != null ? `${weather.windSpeed} km/h` : "--"}
              </p>
            </div>

            {/* Expected Rainfall */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#071911] border border-slate-200/80 dark:border-emerald-900/40 text-center">
              <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <CloudRain className="w-3.5 h-3.5 text-indigo-500" />
                <span>{lang === "hi" ? "बारिश" : "Rainfall"}</span>
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {weather.precipitation != null ? `${weather.precipitation} mm` : "0.0 mm"}
              </p>
            </div>
          </div>

          {/* FARM LOCATION FOOTER */}
          <div className="pt-2 border-t border-slate-100 dark:border-emerald-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#0F5132] dark:text-emerald-400 shrink-0" />
              <span>
                {lang === "hi" ? "फार्म स्थान" : "Farm Location"}:{" "}
                <strong className="font-mono text-slate-700 dark:text-slate-300">
                  {latitude.toFixed(4)}, {longitude.toFixed(4)}
                </strong>
              </span>
            </div>

            {lastRefreshed && (
              <span className="text-[10px] text-slate-400">
                {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
