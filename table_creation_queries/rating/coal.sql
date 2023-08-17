CREATE TABLE IF NOT EXISTS rating.coal
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    coal_id text COLLATE pg_catalog."default" NOT NULL,
    value numeric NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT coal_pkey PRIMARY KEY (user_id, coal_id)
)