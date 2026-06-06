import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapView, MapMarker } from "@/components/MapView";
import { MapPicker } from "@/components/MapPicker";
import ImageUpload from "@/components/ImageUpload";
import { MapPin, Plus, Loader2, Trash2 } from "lucide-react";

interface Landmark {
  id: string;
  name: string;
  description: string | null;
  category: string;
  latitude: number;
  longitude: number;
  images: string[] | null;
}

const CATEGORIES = ["place", "food", "study", "shop", "transport", "health", "other"];

const LocationsPage = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Landmark | null>(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("landmarks")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setLandmarks(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(
    () => landmarks.filter((l) => filter === "all" || l.category === filter),
    [landmarks, filter]
  );

  const markers: MapMarker[] = filtered.map((l) => ({
    id: l.id,
    lat: Number(l.latitude),
    lng: Number(l.longitude),
    title: l.name,
    onClick: () => setSelected(l),
  }));

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this landmark?")) return;
    const { error } = await (supabase as any).from("landmarks").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); setSelected(null); }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <MapPin className="h-7 w-7 text-blue-600" /> Campus Locations
            </h1>
            <p className="text-sm text-muted-foreground">Discover pinned places around campus.</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isAdmin && (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Pin location
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Pin a new landmark</DialogTitle></DialogHeader>
                  <LandmarkForm onSaved={() => { setOpen(false); fetchData(); }} userId={user?.id} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {loading ? (
              <div className="h-[420px] flex items-center justify-center bg-white rounded-lg border">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : markers.length === 0 ? (
              <div className="h-[420px] flex items-center justify-center bg-white rounded-lg border text-muted-foreground">
                No landmarks pinned yet.
              </div>
            ) : (
              <MapView markers={markers} />
            )}
          </div>
          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {filtered.map((l) => (
              <Card key={l.id} className={`p-3 cursor-pointer transition-all ${selected?.id === l.id ? "ring-2 ring-blue-500" : "hover:shadow-md"}`}
                    onClick={() => setSelected(l)}>
                <div className="flex gap-3">
                  {l.images?.[0] && (
                    <img src={l.images[0]} alt={l.name} className="w-16 h-16 rounded object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{l.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{l.category}</p>
                    {l.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{l.description}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {selected && (
          <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
              {selected.images && selected.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selected.images.map((img, i) => (
                    <img key={i} src={img} alt="" className="w-full h-40 object-cover rounded" />
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground capitalize">Category: {selected.category}</p>
              {selected.description && <p className="text-sm">{selected.description}</p>}
              <p className="text-xs text-muted-foreground">
                {selected.latitude.toFixed(5)}, {selected.longitude.toFixed(5)}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selected.latitude},${selected.longitude}`}
                     target="_blank" rel="noreferrer">
                    Open directions
                  </a>
                </Button>
                {isAdmin && (
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(selected.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  );
};

const LandmarkForm = ({ onSaved, userId }: { onSaved: () => void; userId?: string }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("place");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!name || !loc) {
      toast({ title: "Missing data", description: "Name and location required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("landmarks").insert({
      name, description, category,
      latitude: loc.lat, longitude: loc.lng,
      images, created_by: userId,
    });
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Landmark pinned" }); onSaved(); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Location</Label>
        <MapPicker value={loc} onChange={setLoc} />
      </div>
      <div>
        <Label>Images</Label>
        <ImageUpload images={images} onImagesChange={setImages} bucket="campus-media" folder="landmarks" />
      </div>
      <Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save landmark
      </Button>
    </div>
  );
};

export default LocationsPage;
