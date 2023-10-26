export default {
  create: () => `
    INSERT INTO hookah.coal (
      coal_id,
      coal_name,
      fabricator_id,
      coal_description,
      user_id,
      photo_url
    ) VALUES (
      $1, $2, $3, $4, $5, $6
    ) RETURNING coal_id AS id
  `,

  getAll: () => `
    SELECT
      coal_id AS id,
      photo_url AS "photoUrl",
      coal_name AS name,
      fabricator.value AS fabricator,
      (
        SELECT
          COALESCE(ROUND(SUM(rating.coal.value) / COUNT(rating.coal.value), 1), 0)
        FROM rating.coal
        WHERE rating.coal.coal_id = hookah.coal.coal_id
      ) AS rating
    FROM hookah.coal
      LEFT JOIN hookah.fabricator ON hookah.coal.fabricator_id = hookah.fabricator.fabricator_id
    ORDER BY name, rating
  `,

  getById: () => `
    SELECT
      coal.coal_id AS "id",
      coal.coal_name AS "name", 
      coal.fabricator_id AS "fabricatorId",
      fabricator.value AS fabricator,
      coal.coal_description AS description,
      coal.photo_url AS "photoUrl",      
      COALESCE(hookah.favorite_coal.coal_id = $1, false) AS "isFavorite",
      COALESCE((
        SELECT ROUND(SUM(value) / COUNT(value), 1)
        FROM rating.coal
        WHERE rating.coal.coal_id = $1
      ), 0) AS rating, 
      (
        SELECT COUNT(value)
        FROM rating.coal
        WHERE rating.coal.coal_id = $1
      ) AS "ratingsQuantity",
      COALESCE($2 = (
        SELECT user_id
        FROM rating.coal
        WHERE coal_id = $1 AND user_id = $2
      ), false) AS "isRated",
      COALESCE((
        SELECT COUNT(coal_id)
        FROM hookah.favorite_coal
        WHERE favorite_coal.coal_id = $1
      ), 0) AS "markQuantity",
      CONCAT(coal.created_at::text, 'Z') AS "createdAt",
      CONCAT(coal.updated_at::text, 'Z') AS "updatedAt"
    FROM hookah.coal    
    LEFT JOIN hookah.favorite_coal ON (favorite_coal.coal_id = coal.coal_id AND favorite_coal.user_id = $2)
    LEFT JOIN hookah.fabricator ON fabricator.fabricator_id = coal.fabricator_id
    WHERE coal.coal_id = $1      
  `,

  getOldPhotoUrl: () => `        
    SELECT photo_url AS "photoUrl"
    FROM hookah.coal
    WHERE coal_id = $1
  `,

  update: () => `
    UPDATE 
      hookah.coal
    SET
      coal_name = COALESCE($1, coal_name),
      fabricator_id = COALESCE($2, fabricator_id),
      coal_description = COALESCE($3, coal_description),
      photo_url = COALESCE($4, photo_url),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE
      coal.coal_id = $5
    RETURNING
    user_id AS "userId",
    user_id AS "userId",
    coal.coal_id AS "id",
    coal.coal_name AS "name",  
    coal.fabricator_id AS "fabricatorId", 
    (
      SELECT value
      FROM hookah.fabricator
      WHERE fabricator.fabricator_id = coal.fabricator_id
    ) AS fabricator,
    coal.coal_description AS description,
    coal.photo_url AS "photoUrl",  
    COALESCE($5 = (
      SELECT coal_id
      FROM hookah.favorite_coal
      WHERE user_id = $6 AND coal_id = $5
    ), false) AS "isFavorite",    
    COALESCE((
      SELECT ROUND(SUM(value) / COUNT(value), 1)
      FROM rating.coal
      WHERE rating.coal.coal_id = $5
    ), 0) AS rating,
    (
      SELECT COUNT(value)
      FROM rating.coal
      WHERE rating.coal.coal_id = $5
    ) AS "ratingsQuantity",
    COALESCE($6 = (
      SELECT user_id
      FROM rating.coal
      WHERE coal_id = $5 AND user_id = $6
    ), false) AS "isRated",
    (
      SELECT COUNT(hookah.favorite_coal.coal_id)
      FROM hookah.favorite_coal
      WHERE hookah.favorite_coal.coal_id = $5
    ) AS "markQuantity",
      CONCAT(coal.created_at::text, 'Z') AS "createdAt",
      CONCAT(coal.updated_at::text, 'Z') AS "updatedAt"
  `,

  remove: () => `
    DELETE FROM hookah.coal
    WHERE coal_id = $1
    RETURNING *
  `,

  saveDeletedCoal: () => `
    INSERT INTO deleted.coal (
      deleted_id,
      coal_id,
      coal_name,
      fabricator_id,
      coal_description,
      photo_url,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
  `,

  saveDeletedTobacco: () => `
    INSERT INTO deleted.coal (
      deleted_id,
      coal_id,
      coal_name,
      fabricator_id,
      coal_description,
      photo_url,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
  `,

  getCoalComments: () => `      
    SELECT 
      coal_comment.comment_id AS "id",
      coal_comment.coal_id AS "coalId",
      user_data.user.user_id AS "userId",
      user_data.user.login AS login,
      user_data.user.avatar_url AS "userAvatarUrl",
      hookah.coal_comment.comment_text AS "text",
      CONCAT(hookah.coal_comment.created_at, 'Z') AS "createdAt",
      CONCAT(hookah.coal_comment.updated_at, 'Z') AS "updatedAt"
    FROM hookah.coal_comment
    INNER JOIN user_data.user ON coal_comment.user_id = user_data.user.user_id
    WHERE coal_comment.coal_id = $1
  `,
};
