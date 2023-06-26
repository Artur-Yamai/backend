export default {
  addToFavoritesTobacco: () => `
    INSERT INTO hookah.favorite_tobacco_table (user_id, tobacco_id)
    VALUES ($1, $2)
    RETURNING user_id AS "userId", tobacco_id AS "tobaccoId"
  `,

  removeToFavoritesTobacco: () => `
    DELETE FROM hookah.favorite_tobacco_table
    WHERE user_id = $1 AND tobacco_id = $2
  `,
};
