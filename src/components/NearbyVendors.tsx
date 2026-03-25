import { useState } from "react";
import { MapPin, Navigation, Loader2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGPS, haversineDistance } from "@/hooks/useGPS";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface VendorWithLocation {
  id: string;
  business_name: string;
  city: string;
  country: string;
  verified: boolean;
  logo_url: string | null;
  lat?: number;
  lon?: number;
  distanceKm?: number;
}

const NearbyVendors = () => {
  const { location, loading: gpsLoading, error: gpsError, getLocation } = useGPS();
  const [searchTriggered, setSearchTriggered] = useState(false);

  const { data: vendors, isLoading: vendorsLoading } = useQuery({
    queryKey: ["vendors-for-nearby"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("id, business_name, city, country, verified, logo_url")
        .eq("status", "approved")
        .not("city", "is", null);
      if (error) throw error;
      return data || [];
    },
    enabled: searchTriggered,
  });

  const { data: nearbyVendors, isLoading: geocodingLoading } = useQuery({
    queryKey: ["nearby-vendors", location?.latitude, location?.longitude, vendors?.length],
    queryFn: async (): Promise<VendorWithLocation[]> => {
      if (!location || !vendors) return [];

      const results: VendorWithLocation[] = [];
      const cityCache: Record<string, { lat: number; lon: number } | null> = {};
      const uniqueCities = [...new Set(vendors.map((v) => `${v.city}, ${v.country}`))];

      for (const cityCountry of uniqueCities.slice(0, 20)) {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityCountry)}&format=json&limit=1`,
            { headers: { "User-Agent": "RobCompare/1.0 (contact@robcompare.com)" } }
          );
          const data = await res.json();
          if (data?.length) {
            cityCache[cityCountry] = {
              lat: parseFloat(data[0].lat),
              lon: parseFloat(data[0].lon),
            };
          }
          await new Promise((r) => setTimeout(r, 1100));
        } catch {
          cityCache[cityCountry] = null;
        }
      }

      for (const vendor of vendors) {
        const key = `${vendor.city}, ${vendor.country}`;
        const coords = cityCache[key];
        if (coords) {
          const distanceKm = haversineDistance(
            location.latitude, location.longitude, coords.lat, coords.lon
          );
          results.push({ ...vendor, ...coords, distanceKm });
        }
      }

      return results
        .sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999))
        .slice(0, 8);
    },
    enabled: !!location && !!vendors,
    staleTime: 1000 * 60 * 10,
  });

  const handleFindNearby = async () => {
    setSearchTriggered(true);
    await getLocation();
  };

  const isLoading = gpsLoading || vendorsLoading || geocodingLoading;

  if (!searchTriggered) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Navigation className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-semibold">Find Vendors Near You</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Use GPS to discover vendors in your city
          </p>
        </div>
        <Button onClick={handleFindNearby} className="gap-2">
          <MapPin className="w-4 h-4" /> Use My Location
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center space-y-2">
        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground">
          {gpsLoading ? "Getting your location..." : geocodingLoading ? "Finding nearby vendors..." : "Loading vendors..."}
        </p>
      </div>
    );
  }

  if (gpsError) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center space-y-2">
        <MapPin className="w-8 h-8 text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">{gpsError}</p>
        <Button variant="outline" size="sm" onClick={handleFindNearby}>Try Again</Button>
      </div>
    );
  }

  if (!nearbyVendors?.length) {
    return (
      <div className="bg-card border border-border rounded-xl p-5 text-center">
        <p className="text-sm text-muted-foreground">No vendors found near {location?.city || "your location"}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-heading font-semibold flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          Vendors near {location?.city || "you"}
        </h3>
        <span className="text-xs text-muted-foreground">{nearbyVendors.length} found</span>
      </div>
      <div className="divide-y divide-border">
        {nearbyVendors.map((vendor) => (
          <div key={vendor.id} className="flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {vendor.logo_url ? (
                <img src={vendor.logo_url} alt={vendor.business_name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <Store className="w-5 h-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{vendor.business_name}</p>
              <p className="text-xs text-muted-foreground">{vendor.city}, {vendor.country}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {vendor.distanceKm !== undefined && (
                <Badge variant="outline" className="text-xs">
                  {vendor.distanceKm < 1 ? `${Math.round(vendor.distanceKm * 1000)}m` : `${vendor.distanceKm}km`}
                </Badge>
              )}
              {vendor.verified && (
                <Badge className="text-xs bg-primary text-primary-foreground">✓</Badge>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleFindNearby}>
          <Navigation className="w-3 h-3" /> Refresh location
        </Button>
      </div>
    </div>
  );
};

export default NearbyVendors;
