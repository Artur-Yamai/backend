CREATE TABLE IF NOT EXISTS user_data.referral_relation
(
    inviting_user_id text COLLATE pg_catalog."default" NOT NULL,
    invited_user_id text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT referral_relation_pkey PRIMARY KEY (inviting_user_id, invited_user_id)
)