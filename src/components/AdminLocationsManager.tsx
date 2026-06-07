import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  created_at: string;
}

const CATEGORIES = ["place", "food", "study", "shop", "transport", "health", "other"];

const AdminLocationsManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from("landmarks").select("*").order("created_at", { ascending: false });
    if (error) toast({ title: "Error loading landmarks", description: error.message, variant: "destructive" });
    else setLandmarks(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this landmark?")) return;
    const { error } = await (supabase as any).from("landmarks").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); load(); }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <p className="text-gray-500 text-sm">Pin landmarks around campus so students can find them on the map.</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#1B4FA8] hover:bg-[#1B4FA8]/90">
              <Plus className="h-4 w-4 mr-1" /> Pin location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Pin a new landmark</DialogTitle></DialogHeader>
            <LandmarkForm userId={user?.id} onSaved={() => { setOpen(false); load(); }} />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-[#1B4FA8]" /></div>
      ) : landmarks.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          <MapPin className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          No landmarks yet. Click "Pin location" to add your first one.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {landmarks.map((l) => (
            <Card key={l.id} className="overflow-hidden">
              {l.images?.[0] && (
                <img src={l.images[0]} alt={l.name} className="w-full h-36 object-cover" />
              )}
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{l.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{l.category}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50"
                          onClick={() => remove(l.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {l.description && <p className="text-xs text-gray-600 line-clamp-2">{l.description}</p>}
                <p className="text-[10px] text-muted-foreground">
                  {Number(l.latitude).toFixed(5)}, {Number(l.longitude).toFixed(5)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const LandmarkForm = ({ userId, onSaved }: { userId?: string; onSaved: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("place");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!name || !loc) {
      toast({ title: "Missing data", description: "Name and pinned location are required.", variant: "destructive" });
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
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kyambogo Main Gate" /></div>
      <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
      <div>
        <Label>Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div><Label>Pin Location</Label><MapPicker value={loc} onChange={setLoc} /></div>
      <div>
        <Label>Images</Label>
        <ImageUpload images={images} onImagesChange={setImages} bucket="campus-media" folder="landmarks" maxImages={5} />
      </div>
      <Button onClick={save} disabled={saving} className="w-full bg-[#1B4FA8] hover:bg-[#1B4FA8]/90">
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save landmark
      </Button>
    </div>
  );
};

export default AdminLocationsManager;
