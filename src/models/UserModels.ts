export default {
  register: () => `
    INSERT INTO user_data.user (
      user_id,
      login,
      email,
      password_hash
    ) VALUES (
      $1, $2, $3, $4
    ) 
    RETURNING user_id AS id
  `,

  saveNewRefRelation: () => `
    INSERT INTO user_data.referral_relation (
      inviting_user_id,
      invited_user_id
    ) VALUES (
      (
        SELECT user_id
        FROM user_data.referral_code
        WHERE code_value = $1
      ),
      $2
    )
  `,

  auth: () => `
    SELECT
      user_data.user.user_id AS id,
      login,
      email,
      password_hash AS "passwordHash",
      role_code AS "roleCode",
      avatar_url AS "avatarUrl",
      code_value AS "refCode",
      CONCAT(user_data.user.created_at::text, 'Z') AS "createdAt",
      CONCAT(user_data.user.updated_at::text, 'Z') AS "updatedAt"
    FROM user_data.user
    LEFT JOIN user_data.referral_code ON user_data.referral_code.user_id = user_data.user.user_id
    WHERE login ILIKE $1
  `,

  authById: () => `
    SELECT
      user_data.user.user_id AS id,
      login,
      email,
      role_code AS "roleCode",
      avatar_url AS "avatarUrl",
      code_value AS "refCode",
      CONCAT(user_data.user.created_at::text, 'Z') AS "createdAt",
      CONCAT(user_data.user.updated_at::text, 'Z') AS "updatedAt"
    FROM user_data.user     
    LEFT JOIN user_data.referral_code ON user_data.referral_code.user_id = user_data.user.user_id
    WHERE user_data.user.user_id = $1
  `,

  saveAvatar: () => `
    WITH oldValue AS (
      SELECT avatar_url AS "avatarUrl" 
      FROM user_data.user 
      WHERE user_id = $2
    )
    UPDATE user_data.user 
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
    FROM user_data.user
    WHERE user_id = $1
  `,

  loginExists: () => "SELECT user_id FROM user_data.user WHERE login ILIKE $1",

  emailExists: () => "SELECT user_id FROM user_data.user WHERE email ILIKE $1",

  refCodeExist: () =>
    "SELECT user_id FROM user_data.referral_code WHERE code_value = $1",

  getFavoritesTobaccoByUserId: () => `
    SELECT
      tobacco.tobacco_id AS "id",
      tobacco.photo_url AS "photoUrl",
      tobacco.tobacco_name AS "name",
      (
        SELECT
          COALESCE(ROUND(SUM(rating.tobacco.value) / COUNT(rating.tobacco.value), 1), 0)
        FROM rating.tobacco
        WHERE rating.tobacco.tobacco_id = hookah.tobacco.tobacco_id
      ) AS rating
    FROM hookah.favorite_tobacco
    INNER JOIN hookah.tobacco ON tobacco.tobacco_id = favorite_tobacco.tobacco_id
    WHERE favorite_tobacco.user_id = $1
  `,

  getFavoritesCoalByUserId: () => `
    SELECT
      coal.coal_id AS "id",
      coal.photo_url AS "photoUrl",
      coal.coal_name AS "name",
      (
        SELECT
          COALESCE(ROUND(SUM(rating.coal.value) / COUNT(rating.coal.value), 1), 0)
        FROM rating.coal
        WHERE rating.coal.coal_id = hookah.coal.coal_id
      ) AS rating
    FROM hookah.favorite_coal
    INNER JOIN hookah.coal ON coal.coal_id = favorite_coal.coal_id
    WHERE favorite_coal.user_id = $1
  `,
};
