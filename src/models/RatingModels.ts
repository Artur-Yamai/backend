type ratingTableName = "tobacco" | "coal";

export default {
  add: (entityName: ratingTableName) => `
    INSERT INTO rating.${entityName} (
      user_id, ${entityName}_id, value
    ) VALUES ($1, $2, $3)
    RETURNING ${entityName}
  `,

  update: (entityName: ratingTableName) => `
    UPDATE rating.${entityName}
    SET value = $3
    WHERE user_id = $1 AND ${entityName}_id = $2
  `,

  remove: (entityName: ratingTableName) => `
    DELETE FROM rating.${entityName}
    WHERE user_id = $1 AND ${entityName}_id = $2
    RETURNING *
  `,
};
