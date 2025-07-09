
-- Create enum for room types
CREATE TYPE public.room_type AS ENUM (
  'single-self-contained',
  'double-self-contained', 
  'single-shared',
  'double-shared'
);

-- Create owners table
CREATE TABLE public.owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create hostels table
CREATE TABLE public.hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES public.owners(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  images TEXT[] DEFAULT '{}',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID REFERENCES public.hostels(id) ON DELETE CASCADE NOT NULL,
  type room_type NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT,
  images TEXT[] DEFAULT '{}',
  total_rooms INTEGER NOT NULL CHECK (total_rooms > 0),
  available_rooms INTEGER NOT NULL CHECK (available_rooms >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT available_rooms_check CHECK (available_rooms <= total_rooms)
);

-- Enable Row Level Security
ALTER TABLE public.owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hostels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Owners policies
CREATE POLICY "Users can view their own owner profile" ON public.owners
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own owner profile" ON public.owners
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own owner profile" ON public.owners
  FOR UPDATE USING (auth.uid() = user_id);

-- Hostels policies
CREATE POLICY "Anyone can view approved hostels" ON public.hostels
  FOR SELECT USING (approved = true);

CREATE POLICY "Owners can view their own hostels" ON public.hostels
  FOR SELECT USING (
    owner_id IN (
      SELECT id FROM public.owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create hostels" ON public.hostels
  FOR INSERT WITH CHECK (
    owner_id IN (
      SELECT id FROM public.owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update their own hostels" ON public.hostels
  FOR UPDATE USING (
    owner_id IN (
      SELECT id FROM public.owners WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete their own hostels" ON public.hostels
  FOR DELETE USING (
    owner_id IN (
      SELECT id FROM public.owners WHERE user_id = auth.uid()
    )
  );

-- Rooms policies
CREATE POLICY "Anyone can view rooms of approved hostels" ON public.rooms
  FOR SELECT USING (
    hostel_id IN (
      SELECT id FROM public.hostels WHERE approved = true
    )
  );

CREATE POLICY "Owners can view rooms of their hostels" ON public.rooms
  FOR SELECT USING (
    hostel_id IN (
      SELECT h.id FROM public.hostels h
      JOIN public.owners o ON h.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can create rooms for their hostels" ON public.rooms
  FOR INSERT WITH CHECK (
    hostel_id IN (
      SELECT h.id FROM public.hostels h
      JOIN public.owners o ON h.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can update rooms of their hostels" ON public.rooms
  FOR UPDATE USING (
    hostel_id IN (
      SELECT h.id FROM public.hostels h
      JOIN public.owners o ON h.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can delete rooms of their hostels" ON public.rooms
  FOR DELETE USING (
    hostel_id IN (
      SELECT h.id FROM public.hostels h
      JOIN public.owners o ON h.owner_id = o.id
      WHERE o.user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_owners_user_id ON public.owners(user_id);
CREATE INDEX idx_hostels_owner_id ON public.hostels(owner_id);
CREATE INDEX idx_hostels_approved ON public.hostels(approved);
CREATE INDEX idx_rooms_hostel_id ON public.rooms(hostel_id);
CREATE INDEX idx_rooms_type ON public.rooms(type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER owners_updated_at
  BEFORE UPDATE ON public.owners
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER hostels_updated_at
  BEFORE UPDATE ON public.hostels
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
