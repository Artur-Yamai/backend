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
      (
        SELECT value
        FROM hookah.fabricator
        WHERE fabricator.fabricator_id = coal.fabricator_id
      ) AS fabricator,
      coal.fabricator_id AS "fabricatorId",
      coal.coal_description AS description,
      coal.photo_url AS "photoUrl",
      CONCAT(coal.created_at::text, 'Z') AS "createdAt",
      CONCAT(coal.updated_at::text, 'Z') AS "updatedAt",
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
      COALESCE($1 = (
        SELECT coal_id
        FROM hookah.favorite_coal
        WHERE user_id = $2 AND coal_id = $1
      ), false) AS "isFavorite",
      COALESCE((
        SELECT COUNT(coal_id)
        FROM hookah.favorite_coal
        WHERE favorite_coal.coal_id = $1
      ), 0) AS "markQuantity"
    FROM hookah.coal
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
      coal.coal_id AS "id",
      coal.coal_name AS "name",      
      (
        SELECT value
        FROM hookah.fabricator
        WHERE fabricator.fabricator_id = coal.fabricator_id
      ) AS fabricator,
      coal.fabricator_id AS "fabricatorId",
      coal.coal_description AS description,
      coal.photo_url AS "photoUrl",
      user_id AS "userId",
      CONCAT(coal.created_at::text, 'Z') AS "createdAt",
      CONCAT(coal.updated_at::text, 'Z') AS "updatedAt"
  `,

  remove: () => `
    DELETE FROM hookah.coal
    WHERE coal_id = $1
    RETURNING *
  `,

  saveDeletedTobacco: () => `
    INSERT INTO deleted.coal (
      deleted_id,
      coal_id,
      coal_name,
      fabricator_id,
      tobacco_description,
      photo_url,
      user_id,
      created_at,
      updated_at
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
  `,
};
