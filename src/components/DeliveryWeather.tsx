import { useWeather } from "@/hooks/useWeather";
import { useGeoLocation } from "@/hooks/useGeoLocation";

interface DeliveryWeatherProps {
  shippingDays?: number;
}

const DeliveryWeather = ({ shippingDays = 3 }: DeliveryWeatherProps) => {
  const { data: geo } = useGeoLocation();
  const { data: weather } = useWeather(geo?.latitude, geo?.longitude);

  if (!weather || !geo) return null;

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + shippingDays);
  const dateStr = deliveryDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{weather.icon}</span>
      <span>
        Delivery ~{dateStr}: {geo.city} {weather.temperature}°C, {weather.description}
      </span>
    </div>
  );
};

export default DeliveryWeather;
