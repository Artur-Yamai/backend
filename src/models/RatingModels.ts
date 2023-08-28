import { ProductName } from "../types";

export default {
  add: (productName: ProductName) => `
    INSERT INTO rating.${productName} (
      user_id, ${productName}_id, value
    ) VALUES ($1, $2, $3)
    RETURNING ${productName}
  `,

  update: (productName: ProductName) => `
    UPDATE rating.${productName}
    SET value = $3
    WHERE user_id = $1 AND ${productName}_id = $2
  `,

  remove: (productName: ProductName) => `
    DELETE FROM rating.${productName}
    WHERE user_id = $1 AND ${productName}_id = $2
    RETURNING *
  `,

  deleteRatingForProductId: (productName: ProductName) => `    
    DELETE FROM rating.${productName}
    WHERE ${productName}_id = $1
  `,
};
