ALTER TABLE pending
    DROP COLUMN IF EXISTS submitted_by_id;

DROP TABLE IF EXISTS users;