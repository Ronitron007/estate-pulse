-- Icons table: reusable icon library for specs, highlights, etc.
CREATE TABLE IF NOT EXISTS icons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,              -- display name: "Flooring"
  lucide_name TEXT NOT NULL,       -- lucide-react icon name: "layers"
  category TEXT,                   -- grouping: "construction", "rooms", "general"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read, admin write
ALTER TABLE icons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view icons"
  ON icons FOR SELECT USING (true);

CREATE POLICY "Admins can manage icons"
  ON icons FOR ALL
  USING (is_admin());

-- Seed with real-estate-relevant Lucide icons
INSERT INTO icons (name, lucide_name, category) VALUES
  -- Construction & Materials
  ('Flooring', 'layers', 'construction'),
  ('Walls', 'square', 'construction'),
  ('Paint', 'paintbrush', 'construction'),
  ('Tiles', 'grid-3x3', 'construction'),
  ('Cement', 'box', 'construction'),
  ('Steel', 'shield', 'construction'),
  ('Wood', 'tree-pine', 'construction'),
  ('Glass', 'panel-top', 'construction'),
  -- Rooms
  ('Bedroom', 'bed-double', 'rooms'),
  ('Bathroom', 'bath', 'rooms'),
  ('Kitchen', 'cooking-pot', 'rooms'),
  ('Living Room', 'sofa', 'rooms'),
  ('Balcony', 'fence', 'rooms'),
  ('Staircase', 'arrow-up-right', 'rooms'),
  ('Parking', 'car', 'rooms'),
  -- Fittings & Fixtures
  ('Doors', 'door-open', 'fittings'),
  ('Windows', 'app-window', 'fittings'),
  ('Switches', 'toggle-right', 'fittings'),
  ('Plumbing', 'droplets', 'fittings'),
  ('Electrical', 'zap', 'fittings'),
  ('AC', 'snowflake', 'fittings'),
  ('Wardrobe', 'shirt', 'fittings'),
  ('Chimney', 'wind', 'fittings'),
  ('Sink', 'droplet', 'fittings'),
  -- General
  ('Elevator', 'arrow-up-down', 'general'),
  ('Security', 'lock', 'general'),
  ('Fire Safety', 'flame', 'general'),
  ('Power', 'plug-zap', 'general'),
  ('Water', 'waves', 'general'),
  ('Garden', 'flower-2', 'general'),
  ('View', 'eye', 'general'),
  ('Location', 'map-pin', 'general'),
  ('Quality', 'badge-check', 'general'),
  ('Price', 'indian-rupee', 'general'),
  ('Area', 'ruler', 'general'),
  ('Building', 'building-2', 'general'),
  ('Tower', 'building', 'general'),
  ('Home', 'home', 'general'),
  ('Star', 'star', 'general'),
  ('Check', 'circle-check', 'general');
