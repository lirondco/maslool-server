CREATE TABLE pending (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    website TEXT NOT NULL,
    description TEXT NOT NULL,
    safety TEXT,
);