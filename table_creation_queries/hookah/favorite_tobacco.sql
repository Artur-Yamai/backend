CREATE TABLE IF NOT EXISTS hookah.favorite_tobacco
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    tobacco_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT "tobacco_favorite+table_pkey" PRIMARY KEY (user_id, tobacco_id)
)