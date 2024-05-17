-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    description TEXT,
    tier TEXT NOT NULL CHECK (tier IN ('basic', 'pro')) DEFAULT 'basic',
    is_admin INTEGER DEFAULT 0,
    reset_password INTEGER DEFAULT 0
);

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    note TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Forum table
CREATE TABLE IF NOT EXISTS forum (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL CHECK (LENGTH(message) <= 128),
    FOREIGN KEY(user_id) REFERENCES users(id)
);