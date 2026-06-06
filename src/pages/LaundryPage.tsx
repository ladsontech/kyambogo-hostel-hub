import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPicker } from "@/components/MapPicker";
import ImageUpload from "@/components/ImageUpload";
import { Shirt, Plus, Loader2, MessageCircle, Phone, MapPin, Trash2 } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  description: string | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  price_range: string | null;
  services: string[] | null;
  images: string[] | null;
  latitude: number | null;
  longitude: number | null;
}

const LaundryPage = () => {
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("laundry_providers")
      .select("*")
      .order("created_at", { ascending: false });
    setProviders(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this provider?")) return;
    const { error } = await (supabase as any).from("laundry_providers").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Shirt className="h-7 w-7 text-blue-600" /> Laundry Services
            </h1>
            <p className="text-sm text-muted-foreground">Trusted laundry providers around campus.</p>
          </div>
          {isAdmin && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-1" /> Add provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Add laundry provider</DialogTitle></DialogHeader>
                <ProviderForm onSaved={() => { setOpen(false); fetchData(); }} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
        ) : providers.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">No providers yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => (
              <Card key={p.id} className="overflow-hidden flex flex-col">
                {p.images?.[0] && (
                  <img src={p.images[0]} alt={p.name} className="w-full h-40 object-cover" />
                )}
                <div className="p-4 flex-1 flex flex-col">
                  <p className="font-semibold text-lg">{p.name}</p>
                  {p.price_range && <p className="text-blue-600 font-medium text-sm">{p.price_range}</p>}
                  {p.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{p.description}</p>}
                  {p.services && p.services.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.services.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                    </div>
                  )}
                  <div className="mt-auto pt-3 flex flex-wrap gap-2">
                    {p.contact_whatsapp && (
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <a href={`https://wa.me/${p.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                        </a>
                      </Button>
                    )}
                    {p.contact_phone && (
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <a href={`tel:${p.contact_phone}`}><Phone className="h-3 w-3 mr-1" /> Call</a>
                      </Button>
                    )}
                    {p.latitude && p.longitude && (
                      <Button asChild size="sm" variant="outline" className="text-xs">
                        <a href={`https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`}
                           target="_blank" rel="noreferrer">
                          <MapPin className="h-3 w-3 mr-1" /> Directions
                        </a>
                      </Button>
                    )}
                    {isAdmin && (
                      <Button size="sm" variant="ghost" className="text-red-600"
                              onClick={() => handleDelete(p.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const ProviderForm = ({ onSaved }: { onSaved: () => void }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!name) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    const services = servicesText.split(",").map((s) => s.trim()).filter(Boolean);
    const { error } = await (supabase as any).from("laundry_providers").insert({
      name, description,
      contact_phone: phone || null,
      contact_whatsapp: whatsapp || null,
      price_range: priceRange || null,
      services, images,
      latitude: loc?.lat ?? null,
      longitude: loc?.lng ?? null,
    });
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Provider added" }); onSaved(); }
  };

  return (
    <div className="space-y-3">
      <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
      <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
        <div><Label>WhatsApp</Label><Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} /></div>
      </div>
      <div><Label>Price range (e.g. UGX 5,000 - 15,000)</Label><Input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} /></div>
      <div><Label>Services (comma separated)</Label><Input value={servicesText} placeholder="wash, iron, dry-clean" onChange={(e) => setServicesText(e.target.value)} /></div>
      <div><Label>Location (optional)</Label><MapPicker value={loc} onChange={setLoc} /></div>
      <div><Label>Images</Label><ImageUpload images={images} onImagesChange={setImages} bucket="campus-media" folder="laundry" /></div>
      <Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Save provider
      </Button>
    </div>
  );
};

export default LaundryPage;
