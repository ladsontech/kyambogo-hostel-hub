import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPicker } from "@/components/MapPicker";
import ImageUpload from "@/components/ImageUpload";
import { Plus, ShoppingBag, Loader2, MessageCircle, Phone, Trash2 } from "lucide-react";

interface Item {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  price: number;
  condition: string | null;
  images: string[] | null;
  contact_phone: string | null;
  contact_whatsapp: string | null;
  status: string;
  created_at: string;
}

const CATEGORIES = ["electronics", "books", "furniture", "clothing", "appliances", "other"];

const UniMarketPage = () => {
  const { user } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("marketplace_items")
      .select("*")
      .eq("status", "available")
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = items.filter((i) => filter === "all" || i.category === filter);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this listing?")) return;
    const { error } = await (supabase as any).from("marketplace_items").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Deleted" }); fetchData(); }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-7 w-7 text-blue-600" /> UniMarket
            </h1>
            <p className="text-sm text-muted-foreground">Buy and sell used items with fellow students.</p>
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
            {user ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-1" /> Post item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader><DialogTitle>Post a new item</DialogTitle></DialogHeader>
                  <ItemForm userId={user.id} onSaved={() => { setOpen(false); fetchData(); }} />
                </DialogContent>
              </Dialog>
            ) : (
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link to="/auth">Sign in to post</Link>
              </Button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">No items yet. Be the first to post!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} className="overflow-hidden flex flex-col">
                <div className="aspect-square bg-muted">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBag className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <p className="font-semibold line-clamp-1">{item.title}</p>
                  <p className="text-blue-600 font-bold">UGX {item.price.toLocaleString()}</p>
                  <div className="flex gap-1 flex-wrap mt-1">
                    <Badge variant="outline" className="text-xs capitalize">{item.category}</Badge>
                    {item.condition && <Badge variant="secondary" className="text-xs capitalize">{item.condition}</Badge>}
                  </div>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.description}</p>
                  )}
                  <div className="mt-auto pt-3 flex flex-wrap gap-1">
                    {item.contact_whatsapp && (
                      <Button asChild size="sm" variant="outline" className="text-xs h-7">
                        <a href={`https://wa.me/${item.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                          <MessageCircle className="h-3 w-3 mr-1" /> WhatsApp
                        </a>
                      </Button>
                    )}
                    {item.contact_phone && (
                      <Button asChild size="sm" variant="outline" className="text-xs h-7">
                        <a href={`tel:${item.contact_phone}`}><Phone className="h-3 w-3 mr-1" /> Call</a>
                      </Button>
                    )}
                    {(user?.id === item.user_id || isAdmin) && (
                      <Button size="sm" variant="ghost" className="text-xs h-7 text-red-600"
                              onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3" />
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

const ItemForm = ({ userId, onSaved }: { userId: string; onSaved: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [condition, setCondition] = useState("used");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const save = async () => {
    if (!title || !price) {
      toast({ title: "Missing data", description: "Title and price required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("marketplace_items").insert({
      user_id: userId, title, description, category, condition,
      price: parseInt(price, 10) || 0,
      contact_phone: phone || null,
      contact_whatsapp: whatsapp || null,
      images,
    });
    setSaving(false);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Posted" }); onSaved(); }
  };

  return (
    <div className="space-y-3">
      <div>
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Price (UGX)</Label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div>
          <Label>Condition</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="like-new">Like new</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Phone</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div>
          <Label>WhatsApp</Label>
          <Input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>Images</Label>
        <ImageUpload images={images} onImagesChange={setImages} bucket="campus-media" folder="marketplace" />
      </div>
      <Button onClick={save} disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
        {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        Post item
      </Button>
    </div>
  );
};

export default UniMarketPage;
