CREATE TABLE IF NOT EXISTS user_data.password
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT password_pkey PRIMARY KEY (user_id)
)