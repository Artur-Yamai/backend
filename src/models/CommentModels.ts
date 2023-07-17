export default {
  create: () => `
    INSERT INTO hookah.comment (
      comment_id,
      user_id, 
      entity_id, 
      entity_type, 
      comment_text
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING entity_id AS id
  `,

  update: () => `
    UPDATE hookah.comment
    SET comment_text = COALESCE($1, comment_text),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE comment_id = $2
    RETURNING entity_type AS "entityType";
  `,

  remove: () => `
    DELETE FROM hookah.comment
    WHERE comment_id = $1    
    RETURNING *
  `,

  saveDeletedComment: () => `
    INSERT INTO deleted.comment (
      deleted_id,
      comment_id,
      user_id, 
      entity_id, 
      entity_type, 
      comment_text,
      created_at,
      updated_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `,
};
