-- Chat Logs table for Udonarium Lily
CREATE TABLE chat_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL, -- Unix timestamp (ms)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast retrieval of room-specific logs
CREATE INDEX idx_chat_logs_room_id ON chat_logs(room_id);
-- Index for chronological sorting
CREATE INDEX idx_chat_logs_timestamp ON chat_logs(timestamp);
