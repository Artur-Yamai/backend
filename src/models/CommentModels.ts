import { ProductName } from "../types";

export default {
  create: (productName: ProductName) => `
    INSERT INTO hookah.${productName}_comment (
      comment_id,
      user_id, 
      ${productName}_id, 
      comment_text
    )
    VALUES ($1, $2, $3, $4)
    RETURNING comment_id AS id
  `,

  update: (productName: ProductName) => `
    UPDATE hookah.${productName}_comment
    SET comment_text = COALESCE($1, comment_text),
      updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'UTC'
    WHERE comment_id = $2 AND user_id = $3
    RETURNING comment_id AS id
  `,

  remove: (productName: ProductName) => `
    DELETE FROM hookah.${productName}_comment
    WHERE comment_id = $1
  `,

  // saveDeletedComment: () => `
  //   INSERT INTO deleted.comment (
  //     deleted_id,
  //     comment_id,
  //     user_id,
  //     entity_id,
  //     entity_type,
  //     comment_text,
  //     created_at,
  //     updated_at
  //   )
  //   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  // `,

  deleteCommentsForProductId: (productName: ProductName) => `
    DELETE FROM hookah.${productName}_comment
    WHERE ${productName}_id = $1   
  `,
};
