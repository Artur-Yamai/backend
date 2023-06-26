export default {
  create: () => `
    INSERT INTO hookah.tobacco_table (
      tobacco_id,
      tobacco_name,
      fabricator,
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
      fabricator,
      (
        SELECT
          COALESCE(ROUND(SUM(rating_table.rating) / COUNT(rating_table.rating), 1), 0)
        FROM hookah.rating_table
        WHERE rating_table.entity_id = tobacco_table.tobacco_id
      ) AS rating
    FROM
      hookah.tobacco_table
    WHERE
      is_deleted = false
  `,

  getById: () => `
    SELECT
      tobacco_table.tobacco_id AS "id",
      tobacco_table.tobacco_name AS "name",
      tobacco_table.fabricator,
      tobacco_table.tobacco_description AS description,
      tobacco_table.photo_url AS "photoUrl",
      CONCAT(tobacco_table.created_at::text, 'Z') AS "createdAt",
      CONCAT(tobacco_table.updated_at::text, 'Z') AS "updatedAt",
      COALESCE($1 = (
        SELECT tobacco_id
        FROM hookah.favorite_tobacco_table
        WHERE user_id = $2 AND tobacco_id = $1
      ), false) AS "isFavorite",
      COALESCE((
        SELECT ROUND(SUM(rating) / COUNT(rating), 1)
        FROM hookah.rating_table
        WHERE hookah.rating_table.entity_id = $1
      ), 0) AS rating,
      (
        SELECT COUNT(rating)
        FROM hookah.rating_table
        WHERE hookah.rating_table.entity_id = $1
      ) AS "ratingsQuantity",
      COALESCE($2 = (
        SELECT user_id
        FROM hookah.rating_table
        WHERE entity_id = $1 AND user_id = $2
      ), false) AS "isRated",
      COALESCE((
        SELECT COUNT(tobacco_id)
        FROM hookah.favorite_tobacco_table
        WHERE favorite_tobacco_table.tobacco_id = $1
      ), 0) AS "markQuantity"
    FROM hookah.tobacco_table
    LEFT JOIN hookah.favorite_tobacco_table ON favorite_tobacco_table.tobacco_id = tobacco_table.tobacco_id
    WHERE tobacco_table.tobacco_id = $1 AND is_deleted = false
  `,

  getOldPhotoUrl: () => `
    SELECT photo_url AS "photoUrl"
    FROM hookah.tobacco_table
    WHERE tobacco_id = $1
  `,

  update: () => `
    UPDATE 
      hookah.tobacco_table
    SET
      tobacco_name = COALESCE($1, tobacco_name),
      fabricator = COALESCE($2, fabricator),
      tobacco_description = COALESCE($3, tobacco_description),
      photo_url = COALESCE($4, photo_url),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      tobacco_id = $5
    RETURNING 
      tobacco_id AS id,
      tobacco_name AS name,
      fabricator,
      tobacco_description AS description,
      photo_url AS "photoUrl",
      user_id AS "userId",
      CONCAT(created_at::text, 'Z') AS "createdAt",
      CONCAT(updated_at::text, 'Z') AS "updatedAt",
    (
      SELECT
        COALESCE($5 = (
          SELECT tobacco_id
          FROM hookah.favorite_tobacco_table
          WHERE user_id = $6 AND tobacco_id = $5
        ), false) AS "isFavorite"
      FROM hookah.tobacco_table
      LEFT JOIN hookah.favorite_tobacco_table ON favorite_tobacco_table.tobacco_id = tobacco_table.tobacco_id
      WHERE tobacco_table.tobacco_id = $5 AND is_deleted = false
    ) AS "isFavorite"
  `,

  remove: () => `
    UPDATE hookah.tobacco_table
    SET is_deleted = true
    WHERE tobacco_id = $1
    RETURNING
      tobacco_id AS id,
      is_deleted AS "isDeleted"
  `,

  getTobaccoComments: () => `
    SELECT 
      comment_table.comment_id AS "id",
      comment_table.entity_id AS "tobaccoId",
      CONCAT(comment_table.created_at::text, 'Z') AS "createdAt",
      CONCAT(comment_table.updated_at::text, 'Z') AS "updatedAt",
      user_table.user_id AS "userId",
      user_table.login AS "userLogin",
      user_table.avatar_url AS "userAvatarUrl",
      comment_table.comment_text AS "text"    
    FROM hookah.comment_table
    INNER JOIN hookah.user_table ON comment_table.user_id = user_table.user_id
    WHERE comment_table.entity_id = $1 AND comment_table.is_deleted = false;
  `,
};
