"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers, MapPin, Crosshair, ZoomIn, ZoomOut, Check } from "lucide-react";

export type TileProviderType = "osm" | "satellite";

export interface TileProviderConfig {
  id: TileProviderType;
  labelEn: string;
  labelHi: string;
  url: string;
  attribution: string;
  maxZoom: number;
}

export const MAP_PROVIDERS: Record<TileProviderType, TileProviderConfig> = {
  osm: {
    id: "osm",
    labelEn: "Street Map",
    labelHi: "सड़क नक्शा",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
    maxZoom: 19,
  },
  satellite: {
    id: "satellite",
    labelEn: "Satellite",
    labelHi: "उपग्रह (सैटेलाइट)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Earthstar Geographics",
    maxZoom: 19,
  },
};

// Default center coordinates: Geographic center of India
const DEFAULT_CENTER: [number, number] = [22.9734, 78.6569];
const DEFAULT_ZOOM = 5;
const LOCATED_ZOOM = 16;

const createCustomPinIcon = () => {
  return L.divIcon({
    className: "custom-farm-pin",
    html: `
      <div style="position: relative; width: 40px; height: 40px; transform: translate(-20px, -40px); cursor: grab;">
        <div style="position: absolute; left: 10px; top: 10px; width: 20px; height: 20px; border-radius: 50%; background: rgba(16, 185, 129, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="#0F5132" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.35));">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3.2" fill="#ffffff"></circle>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

interface FarmLocationMapProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  lang?: "en" | "hi";
  readOnly?: boolean;
}

export default function FarmLocationMap({
  latitude,
  longitude,
  onLocationSelect,
  lang = "en",
  readOnly = false,
}: FarmLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<TileProviderType>("osm");

  // Keep a stable ref for onLocationSelect
  const onLocationSelectRef = useRef(onLocationSelect);
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const initialCenter =
      latitude && longitude ? [latitude, longitude] as [number, number] : DEFAULT_CENTER;
    const initialZoom = latitude && longitude ? LOCATED_ZOOM : DEFAULT_ZOOM;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: false, // Custom styled zoom controls
    });

    const activeConfig = MAP_PROVIDERS[activeLayer];
    const tileLayer = L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: activeConfig.maxZoom,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = map;

    // Handle map click to place / move marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      if (readOnly) return;
      const { lat, lng } = e.latlng;
      const roundedLat = parseFloat(lat.toFixed(6));
      const roundedLng = parseFloat(lng.toFixed(6));
      onLocationSelectRef.current(roundedLat, roundedLng);
    });

    // Invalidate size once container is measured
    setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Update or switch tile layer
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const map = mapInstanceRef.current;
    map.removeLayer(tileLayerRef.current);

    const config = MAP_PROVIDERS[activeLayer];
    const newTileLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeLayer]);

  // Sync marker and map center with latitude / longitude props
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (latitude !== null && longitude !== null) {
      const latLng: [number, number] = [latitude, longitude];

      if (!markerRef.current) {
        // Create new draggable marker
        const marker = L.marker(latLng, {
          icon: createCustomPinIcon(),
          draggable: !readOnly,
          autoPan: true,
        }).addTo(map);

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          const rLat = parseFloat(pos.lat.toFixed(6));
          const rLng = parseFloat(pos.lng.toFixed(6));
          onLocationSelectRef.current(rLat, rLng);
        });

        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng(latLng);
      }

      // Smooth pan to location if outside current bounds
      if (!map.getBounds().contains(latLng)) {
        map.setView(latLng, Math.max(map.getZoom(), LOCATED_ZOOM), { animate: true });
      }
    } else {
      // Remove marker if cleared
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }
  }, [latitude, longitude, readOnly]);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn();
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut();
  }, []);

  const handleRecenter = useCallback(() => {
    if (!mapInstanceRef.current) return;
    if (latitude !== null && longitude !== null) {
      mapInstanceRef.current.setView([latitude, longitude], LOCATED_ZOOM, { animate: true });
    } else {
      mapInstanceRef.current.setView(DEFAULT_CENTER, DEFAULT_ZOOM, { animate: true });
    }
  }, [latitude, longitude]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-300 dark:border-emerald-800/60 shadow-inner bg-slate-100 dark:bg-[#061810]">
      {/* MAP CANVAS */}
      <div
        ref={mapContainerRef}
        className="h-64 sm:h-72 w-full z-0 cursor-crosshair focus:outline-none"
        style={{ minHeight: "260px" }}
      />

      {/* TOP CONTROLS: LAYER SWITCHER */}
      <div className="absolute top-3 left-3 z-[400] flex items-center bg-white/90 dark:bg-[#071911]/90 backdrop-blur-md rounded-xl p-1 border border-slate-200 dark:border-emerald-800/60 shadow-md">
        <button
          type="button"
          onClick={() => setActiveLayer("osm")}
          className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeLayer === "osm"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>{lang === "hi" ? MAP_PROVIDERS.osm.labelHi : MAP_PROVIDERS.osm.labelEn}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveLayer("satellite")}
          className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
            activeLayer === "satellite"
              ? "bg-[#0F5132] text-white shadow-xs"
              : "text-slate-700 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <MapPin className="w-3 h-3" />
          <span>{lang === "hi" ? MAP_PROVIDERS.satellite.labelHi : MAP_PROVIDERS.satellite.labelEn}</span>
        </button>
      </div>

      {/* TOP RIGHT: ZOOM & RECENTER CONTROLS */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="p-1.5 rounded-lg bg-white/90 dark:bg-[#071911]/90 backdrop-blur-md border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 shadow-md transition-all active:scale-95"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="p-1.5 rounded-lg bg-white/90 dark:bg-[#071911]/90 backdrop-blur-md border border-slate-200 dark:border-emerald-800/60 text-slate-700 dark:text-slate-200 hover:text-emerald-700 shadow-md transition-all active:scale-95"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleRecenter}
          aria-label="Center on farm location"
          title={lang === "hi" ? "स्थान पर केंद्रित करें" : "Center on Farm"}
          className="p-1.5 rounded-lg bg-white/90 dark:bg-[#071911]/90 backdrop-blur-md border border-slate-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 shadow-md transition-all active:scale-95"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* BOTTOM HINT BANNER */}
      <div className="absolute bottom-2 left-2 right-2 z-[400] pointer-events-none">
        <div className="mx-auto max-w-fit px-3 py-1 rounded-full bg-slate-900/80 dark:bg-black/80 backdrop-blur-md text-[11px] text-white/90 border border-white/10 text-center shadow-lg">
          {latitude && longitude
            ? lang === "hi"
              ? "फार्म का स्थान निर्धारित है • पिन को खींचकर (ड्रैग) स्थान समायोजित करें"
              : "Farm location placed • Drag pin or click anywhere to adjust"
            : lang === "hi"
            ? "मानचित्र पर कहीं भी क्लिक कर अपना फार्म अथवा तालाब चुनें"
            : "Click anywhere on map to pin your farm or pond"}
        </div>
      </div>
    </div>
  );
}
