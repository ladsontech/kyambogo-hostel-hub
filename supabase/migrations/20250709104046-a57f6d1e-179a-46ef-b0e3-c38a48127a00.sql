
-- Add price_period column to rooms table
ALTER TABLE public.rooms 
ADD COLUMN price_period TEXT NOT NULL DEFAULT 'semester' 
CHECK (price_period IN ('month', 'semester'));

-- Update existing rows to have default value
UPDATE public.rooms SET price_period = 'semester' WHERE price_period IS NULL;
