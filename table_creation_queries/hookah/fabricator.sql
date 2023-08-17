CREATE TABLE IF NOT EXISTS hookah.fabricator
(
    fabricator_id text COLLATE pg_catalog."default" NOT NULL,
    value text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT fabricator_table_pkey PRIMARY KEY (fabricator_id)
)