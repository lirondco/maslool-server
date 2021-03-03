CREATE TABLE locations (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    trail_id INTEGER
        REFERENCES trails(id) ON DELETE CASCADE NOT NULL,
    address_line TEXT NOT NULL,
    city TEXT NOT NULL,
    region TEXT NOT NULL,
    postal_code TEXT NOT NULL
);