CREATE TABLE comments (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    trail_id INTEGER
        REFERENCES trails(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    last_modified TIMESTAMP DEFAULT now() NOT NULL,
    flagged BOOLEAN DEFAULT false,
    flagged_by TEXT
);

