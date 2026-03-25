import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export interface GPSLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  city?: string;
  country?: string;
  address?: string;
  districtArea?: string;
}

export interface NearbyVendorDistance {
  vendorId: string;
  distanceKm: number;
}

/** Haversine formula — distance between two lat/lng points in km */
export const haversineDistance = (
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

/** Reverse geocode using Nominatim (OpenStreetMap) — free, no key */
export const reverseGeocode = async (
  lat: number,
  lon: number
): Promise<{ city: string; country: string; address: string; districtArea: string }> => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
    { headers: { "User-Agent": "RobCompare/1.0 (contact@robcompare.com)" } }
  );
  if (!res.ok) throw new Error("Nominatim reverse geocode failed");
  const data = await res.json();
  const addr = data.address || {};
  return {
    city: addr.city || addr.town || addr.village || addr.county || "",
    country: addr.country || "",
    address: data.display_name || "",
    districtArea: addr.suburb || addr.district || addr.state_district || addr.state || "",
  };
};

/** Hook: get user's real GPS coordinates via browser + reverse geocode */
export const useGPS = () => {
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return null;
    }

    setLoading(true);
    setError(null);

    return new Promise<GPSLocation | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          try {
            const geo = await reverseGeocode(latitude, longitude);
            const result: GPSLocation = {
              latitude,
              longitude,
              accuracy,
              ...geo,
            };
            setLocation(result);
            setLoading(false);
            resolve(result);
          } catch {
            const result: GPSLocation = { latitude, longitude, accuracy };
            setLocation(result);
            setLoading(false);
            resolve(result);
          }
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  return { location, error, loading, getLocation };
};

/** Forward geocode a city/address to lat/lng using Nominatim */
export const geocodeAddress = async (
  address: string
): Promise<{ lat: number; lon: number; displayName: string } | null> => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
    { headers: { "User-Agent": "RobCompare/1.0 (contact@robcompare.com)" } }
  );
  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.length) return null;
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
};
