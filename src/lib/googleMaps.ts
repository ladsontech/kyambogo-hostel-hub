// Singleton Google Maps JS API loader
let loadingPromise: Promise<any> | null = null;

export const loadGoogleMaps = (): Promise<any> => {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if ((window as any).google?.maps) return Promise.resolve((window as any).google);
  if (loadingPromise) return loadingPromise;

  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  loadingPromise = new Promise((resolve, reject) => {
    const cbName = "__gmapsInit_" + Math.random().toString(36).slice(2);
    (window as any)[cbName] = () => {
      resolve((window as any).google);
      delete (window as any)[cbName];
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&libraries=places&callback=${cbName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return loadingPromise;
};

// Default center: Kyambogo University, Kampala
export const DEFAULT_CENTER = { lat: 0.3492, lng: 32.6308 };
