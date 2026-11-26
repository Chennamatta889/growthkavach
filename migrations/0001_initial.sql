CREATE TABLE IF NOT EXISTS usage_events(day TEXT NOT NULL,kind TEXT NOT NULL,actor TEXT NOT NULL,ts INTEGER NOT NULL);
CREATE INDEX IF NOT EXISTS usage_actor_day ON usage_events(day,kind,actor);
CREATE INDEX IF NOT EXISTS usage_kind_time ON usage_events(kind,ts);
CREATE TABLE IF NOT EXISTS audit_cache(cache_key TEXT PRIMARY KEY,expires INTEGER NOT NULL,result TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS audit_cache_expiry ON audit_cache(expires);
