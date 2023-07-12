export default {
  create: () => `
    INSERT INTO hookah.tobacco (
      tobacco_id,
      tobacco_name,
      fabricator_id,
      tobacco_description,
      user_id,
      photo_url
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING tobacco_id AS id
  `,

  getAll: () => `
    SELECT
      tobacco_id AS id,
      photo_url AS "photoUrl",
      tobacco_name AS name,
      (
        SELECT value
        FROM hookah.fabricator
        WHERE fabricator.fabricator_id = tobacco.fabricator_id
      ) AS fabricator,
      (
        SELECT
          COALESCE(ROUND(SUM(rating.rating) / COUNT(rating.rating), 1), 0)
        FROM hookah.rating
        WHERE rating.entity_id = tobacco.tobacco_id
      ) AS rating
    FROM
      hookah.tobacco
    WHERE
      is_deleted = false
    ORDER BY name
  `,

  getById: () => `
    SELECT
      tobacco.tobacco_id AS "id",
      tobacco.tobacco_name AS "name",      
      (
        SELECT value
        FROM hookah.fabricator
        WHERE fabricator.fabricator_id = tobacco.fabricator_id
      ) AS fabricator,
      tobacco.fabricator_id AS "fabricatorId",
      tobacco.tobacco_description AS description,
      tobacco.photo_url AS "photoUrl",
      CONCAT(tobacco.created_at::text, 'Z') AS "createdAt",
      CONCAT(tobacco.updated_at::text, 'Z') AS "updatedAt",
      COALESCE($1 = (
        SELECT tobacco_id
        FROM hookah.favorite_tobacco
        WHERE user_id = $2 AND tobacco_id = $1
      ), false) AS "isFavorite",
      COALESCE((
        SELECT ROUND(SUM(rating) / COUNT(rating), 1)
        FROM hookah.rating
        WHERE hookah.rating.entity_id = $1
      ), 0) AS rating,
      (
        SELECT COUNT(rating)
        FROM hookah.rating
        WHERE hookah.rating.entity_id = $1
      ) AS "ratingsQuantity",
      COALESCE($2 = (
        SELECT user_id
        FROM hookah.rating
        WHERE entity_id = $1 AND user_id = $2
      ), false) AS "isRated",
      COALESCE((
        SELECT COUNT(tobacco_id)
        FROM hookah.favorite_tobacco
        WHERE favorite_tobacco.tobacco_id = $1
      ), 0) AS "markQuantity"
    FROM hookah.tobacco
    LEFT JOIN hookah.favorite_tobacco ON favorite_tobacco.tobacco_id = tobacco.tobacco_id
    WHERE tobacco.tobacco_id = $1
  `,

  getOldPhotoUrl: () => `
    SELECT photo_url AS "photoUrl"
    FROM hookah.tobacco
    WHERE tobacco_id = $1
  `,

  update: () => `
    UPDATE 
      hookah.tobacco
    SET
      tobacco_name = COALESCE($1, tobacco_name),
      fabricator_id = COALESCE($2, fabricator_id),
      tobacco_description = COALESCE($3, tobacco_description),
      photo_url = COALESCE($4, photo_url),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      tobacco_id = $5
    RETURNING 
      tobacco_id AS id,
      tobacco_name AS name,
      (
        SELECT value
        FROM hookah.fabricator
        WHERE fabricator.fabricator_id = tobacco.fabricator_id
      ) AS fabricator,
      COALESCE((
        SELECT ROUND(SUM(rating) / COUNT(rating), 1)
        FROM hookah.rating
        WHERE hookah.rating.entity_id = $1
      ), 0) AS rating,
      (
        SELECT COUNT(rating)
        FROM hookah.rating
        WHERE hookah.rating.entity_id = $1
      ) AS "ratingsQuantity",
      tobacco.fabricator_id AS "fabricatorId",
      tobacco_description AS description,
      photo_url AS "photoUrl",
      user_id AS "userId",
      CONCAT(created_at::text, 'Z') AS "createdAt",
      CONCAT(updated_at::text, 'Z') AS "updatedAt",
    (
      SELECT
        COALESCE($5 = (
          SELECT tobacco_id
          FROM hookah.favorite_tobacco
          WHERE user_id = $6 AND tobacco_id = $5
        ), false) AS "isFavorite"
      FROM hookah.tobacco
      LEFT JOIN hookah.favorite_tobacco ON favorite_tobacco.tobacco_id = tobacco.tobacco_id
      WHERE tobacco.tobacco_id = $5
    ) AS "isFavorite"
  `,

  remove: () => `
    DELETE FROM hookah.tobacco
    WHERE tobacco_id = $1
    RETURNING tobacco_id AS id
  `,

  getTobaccoComments: () => `
    SELECT 
      comment.comment_id AS "id",
      comment.entity_id AS "tobaccoId",
      hookah.user.user_id AS "userId",
      hookah.user.login AS login,
      hookah.user.avatar_url AS "userAvatarUrl",
      hookah.comment.comment_text AS "text"
    FROM hookah.comment
    INNER JOIN hookah.user ON comment.user_id = hookah.user.user_id
    WHERE comment.entity_id = $1
  `,
};
