CREATE TABLE IF NOT EXISTS hookah.tobacco_comment
(
    comment_id text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default" NOT NULL,
    tobacco_id text COLLATE pg_catalog."default" NOT NULL,
    comment_text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT comment_table_pkey1 PRIMARY KEY (comment_id)
)