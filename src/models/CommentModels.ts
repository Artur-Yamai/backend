export default {
  create: () => `
    INSERT INTO hookah.tobacco_comment (
      comment_id,
      user_id, 
      tobacco_id, 
      comment_text
    )
    VALUES ($1, $2, $3, $4)
    RETURNING comment_id AS id
  `,

  update: () => `
    UPDATE hookah.tobacco_comment
    SET comment_text = COALESCE($1, comment_text),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE comment_id = $2 AND user_id = $3
    RETURNING comment_id AS id
  `,

  remove: () => `
    DELETE FROM hookah.tobacco_comment
    WHERE comment_id = $1    
    RETURNING *
  `,

  saveDeletedComment: () => `
    INSERT INTO deleted.tobacco_comment (
      deleted_id,
      comment_id,
      user_id, 
      tobacco_id, 
      comment_text,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
};
