export default {
  add: () => `
    INSERT INTO hookah.tobacco_rating (
      user_id, tobacco_id, value
    ) VALUES ($1, $2, $3)
    RETURNING tobacco_rating
  `,

  update: () => `
    UPDATE hookah.tobacco_rating
    SET value = $3
    WHERE user_id = $1 AND tobacco_id = $2
  `,

  remove: () => `
    DELETE FROM hookah.tobacco_rating
    WHERE user_id = $1 AND tobacco_id = $2
  `,
};
