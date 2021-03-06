CREATE TYPE difficulty_level AS ENUM (
    'Beginner',
    'Intermediate',
    'Advanced'
);

ALTER TABLE trails
    ADD COLUMN
        difficulty difficulty_level;