CREATE TABLE IF NOT EXISTS hookah.coal_comment
(
    comment_id text COLLATE pg_catalog."default" NOT NULL,
    user_id text COLLATE pg_catalog."default" NOT NULL,
    coal_id text COLLATE pg_catalog."default" NOT NULL,
    comment_text text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT coal_comment_pkey PRIMARY KEY (comment_id, user_id)
)