CREATE TABLE IF NOT EXISTS user_data.referral_code
(
    user_id text COLLATE pg_catalog."default" NOT NULL,
    code_value character varying(20) COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    updated_at timestamp without time zone NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC'::text),
    CONSTRAINT referral_code_pkey PRIMARY KEY (user_id),
    CONSTRAINT referral_code_value_key UNIQUE (code_value)
)