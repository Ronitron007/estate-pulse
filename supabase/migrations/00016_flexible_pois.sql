-- Flexible points of interest array
-- Example: [{"name": "Elante Mall", "category": "shopping", "distance_value": 5.5, "distance_unit": "km"}]
-- Categories: transport, education, healthcare, shopping, food, lifestyle, notable
ALTER TABLE projects ADD COLUMN IF NOT EXISTS points_of_interest JSONB DEFAULT '[]'::jsonb;
