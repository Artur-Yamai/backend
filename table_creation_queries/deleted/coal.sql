CREATE TABLE IF NOT EXISTS deleted.coal
(
    deleted_id text COLLATE pg_catalog."default" NOT NULL,
    coal_id text COLLATE pg_catalog."default" NOT NULL,
    coal_name text COLLATE pg_catalog."default" NOT NULL,
    fabricator_id text COLLATE pg_catalog."default" NOT NULL,
    coal_description text COLLATE pg_catalog."default" NOT NULL,
    photo_url text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT coal_pkey PRIMARY KEY (deleted_id)
)