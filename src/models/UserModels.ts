export default {
  register: () => `
    INSERT INTO hookah.user_table (
      user_id,
      login,
      email,
      password_hash
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING user_id AS id
  `,

  auth: () => `
    SELECT
      user_id AS id,
      login,
      email,
      password_hash AS "passwordHash",
      role_code AS "roleCode",
      avatar_url AS "avatarUrl",
      CONCAT(created_at::text, 'Z') AS "createdAt",
      CONCAT(updated_at::text, 'Z') AS "updatedAt"
    FROM hookah.user_table 
    WHERE login ILIKE $1
  `,

  authById: () => `
    SELECT
      user_id AS id,
      login,
      email,
      password_hash AS "passwordHash",
      role_code AS "roleCode",
      avatar_url AS "avatarUrl",
      CONCAT(created_at::text, 'Z') AS "createdAt",
      CONCAT(updated_at::text, 'Z') AS "updatedAt"
    FROM hookah.user_table 
    WHERE user_id = $1
  `,

  saveAvatar: () => `
    WITH oldValue AS (
      SELECT avatar_url AS "avatarUrl" 
      FROM hookah.user_table 
      WHERE user_id = $2
    )
    UPDATE hookah.user_table 
    SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE user_id = $2
    RETURNING (SELECT * FROM oldValue)
  `,

  getUserById: () => `
    SELECT
      user_id AS id,
      login,
      email,
      role_code AS "roleCode",
      avatar_url AS "avatarUrl",
      CONCAT(created_at::text, 'Z') AS "createdAt",
      CONCAT(updated_at::text, 'Z') AS "updatedAt"
    FROM hookah.user_table
    WHERE user_id = $1
  `,

  loginExists: () => `SELECT user_id FROM hookah.user_table WHERE login = $1`,

  emailExists: () => `SELECT user_id FROM hookah.user_table WHERE email = $1`,

  getFavoritesTobaccoByUserId: () => `
    SELECT
      tobacco_table.tobacco_id AS "id",
      tobacco_table.photo_url AS "photoUrl",
      tobacco_table.tobacco_name AS "name",
      (
        SELECT
          COALESCE(ROUND(SUM(rating_table.rating) / COUNT(rating_table.rating), 1), 0)
        FROM hookah.rating_table
        WHERE rating_table.entity_id = tobacco_table.tobacco_id
      ) AS rating
    FROM hookah.favorite_tobacco_table
    INNER JOIN hookah.tobacco_table ON tobacco_table.tobacco_id = favorite_tobacco_table.tobacco_id
    WHERE favorite_tobacco_table.user_id = $1 AND is_deleted = false
  `,
};
