export default {
  add: () => `
    INSERT INTO hookah.rating (
      user_id, entity_id, rating
    ) VALUES ($1, $2, $3)
    RETURNING rating
  `,

  update: () => `
    UPDATE hookah.rating
    SET rating = $3
    WHERE user_id = $1 AND entity_id = $2
  `,

  remove: () => `
    DELETE FROM hookah.rating
    WHERE user_id = $1 AND entity_id = $2
  `,
};
