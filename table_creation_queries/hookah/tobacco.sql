CREATE TABLE IF NOT EXISTS hookah.tobacco
(
    tobacco_id text COLLATE pg_catalog."default" NOT NULL,
    tobacco_name text COLLATE pg_catalog."default" NOT NULL,
    fabricator_id text COLLATE pg_catalog."default" NOT NULL,
    tobacco_description text COLLATE pg_catalog."default" NOT NULL,
    photo_url text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT tobacco_pkey PRIMARY KEY (tobacco_id),
    CONSTRAINT tobacco_tobacco_name_key UNIQUE (tobacco_name)
)