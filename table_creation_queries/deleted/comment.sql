CREATE TABLE IF NOT EXISTS deleted.comment
(
    deleted_id text COLLATE pg_catalog."default" NOT NULL,
    comment_id text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default" NOT NULL,
    entity_id text COLLATE pg_catalog."default" NOT NULL,
    entity_type text COLLATE pg_catalog."default" NOT NULL,
    comment_text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT comment_pkey1 PRIMARY KEY (deleted_id)
)