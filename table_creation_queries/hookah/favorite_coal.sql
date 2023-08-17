CREATE TABLE IF NOT EXISTS hookah.favorite_coal
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    coal_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT favorite_coal_pkey PRIMARY KEY (user_id, coal_id)
)