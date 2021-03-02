ALTER TABLE trails DROP COLUMN IF EXISTS difficulty;
ALTER TABLE pending DROP COLUMN IF EXISTS difficulty;

DROP TYPE IF EXISTS difficulty_level;