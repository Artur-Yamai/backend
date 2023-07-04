export default {
  getAll: (name: string) => `
    SELECT ${name}_id AS id, value 
    FROM hookah.${name}
    WHERE is_deleted = false
    ORDER BY value
  `,

  create: (name: string) => `
    INSERT INTO hookah.${name} ( ${name}_id, value )
    VALUES ($1, $2)
    RETURNING ${name}_id AS id, value
  `,

  update: (name: string) => `
    UPDATE hookah.${name} 
    SET value = $2
    WHERE ${name}_id = $1
    RETURNING ${name}_id AS id, value
  `,

  remove: (name: string) => `
    UPDATE hookah.${name}
    SET is_deleted = true
    WHERE ${name}_id = $1
    RETURNING ${name}_id AS id
  `,
};
