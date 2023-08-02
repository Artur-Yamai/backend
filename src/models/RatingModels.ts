export default {
  add: (tableName: string) => `
    INSERT INTO rating.${tableName} (
      user_id, tobacco_id, value
    ) VALUES ($1, $2, $3)
    RETURNING ${tableName}
  `,

  update: (tableName: string) => `
    UPDATE rating.${tableName}
    SET value = $3
    WHERE user_id = $1 AND tobacco_id = $2
  `,

  remove: (tableName: string) => `
    DELETE FROM rating.${tableName}
    WHERE user_id = $1 AND tobacco_id = $2
  `,
};
