import { useEffect, useRef } from "react";
import { loadGoogleMaps, DEFAULT_CENTER } from "@/lib/googleMaps";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  onClick?: () => void;
}

interface Props {
  markers: MapMarker[];
  height?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const MapView = ({ markers, height = "420px", center, zoom = 15 }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerObjs = useRef<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then((g) => {
      if (cancelled || !ref.current) return;
      mapRef.current = new g.maps.Map(ref.current, {
        center: center ?? markers[0] ?? DEFAULT_CENTER,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
      });
      renderMarkers(g);
    }).catch(console.error);
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const g = (window as any).google;
    if (g) renderMarkers(g);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers]);

  const renderMarkers = (g: any) => {
    markerObjs.current.forEach((m) => m.setMap(null));
    markerObjs.current = [];
    const bounds = new g.maps.LatLngBounds();
    markers.forEach((m) => {
      const marker = new g.maps.Marker({
        position: { lat: m.lat, lng: m.lng },
        map: mapRef.current,
        title: m.title,
      });
      if (m.onClick) marker.addListener("click", m.onClick);
      markerObjs.current.push(marker);
      bounds.extend({ lat: m.lat, lng: m.lng });
    });
    if (markers.length > 1) mapRef.current.fitBounds(bounds);
    else if (markers.length === 1) mapRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
  };

  return <div ref={ref} style={{ height, width: "100%" }} className="rounded-lg border bg-muted" />;
};
