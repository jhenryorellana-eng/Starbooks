-- Add module grouping fields to step4_chapters
ALTER TABLE step4_chapters ADD COLUMN IF NOT EXISTS module_number INT DEFAULT 1;
ALTER TABLE step4_chapters ADD COLUMN IF NOT EXISTS module_title TEXT DEFAULT 'Modulo 1';
