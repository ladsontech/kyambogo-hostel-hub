import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Crosshair } from "lucide-react";
import { loadGoogleMaps, DEFAULT_CENTER } from "@/lib/googleMaps";

interface Props {
  value?: { lat: number; lng: number } | null;
  onChange: (loc: { lat: number; lng: number }) => void;
  height?: string;
}

export const MapPicker = ({ value, onChange, height = "320px" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((g) => {
      if (cancelled || !ref.current) return;
      const center = value ?? DEFAULT_CENTER;
      mapRef.current = new g.maps.Map(ref.current, {
        center,
        zoom: 16,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      markerRef.current = new g.maps.Marker({
        map: mapRef.current,
        position: center,
        draggable: true,
      });
      markerRef.current.addListener("dragend", () => {
        const p = markerRef.current.getPosition();
        onChange({ lat: p.lat(), lng: p.lng() });
      });
      mapRef.current.addListener("click", (e: any) => {
        markerRef.current.setPosition(e.latLng);
        onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
      setReady(true);
    }).catch(console.error);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (ready && value && markerRef.current) {
      markerRef.current.setPosition(value);
      mapRef.current?.panTo(value);
    }
  }, [value, ready]);

  const useCurrent = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        onChange(loc);
        if (markerRef.current) markerRef.current.setPosition(loc);
        mapRef.current?.panTo(loc);
        mapRef.current?.setZoom(17);
      },
      (err) => alert("Could not get location: " + err.message)
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={useCurrent}>
          <Crosshair className="h-4 w-4 mr-1" /> Use current location
        </Button>
        {value && (
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        )}
      </div>
      <div ref={ref} style={{ height, width: "100%" }} className="rounded-md border bg-muted" />
      <p className="text-xs text-muted-foreground">Tap on map or drag the pin to set location.</p>
    </div>
  );
};
