import { ProductName } from "../types";

export default {
  add: (productName: ProductName) => `
    INSERT INTO hookah.favorite_${productName} (user_id, ${productName}_id)
    VALUES ($1, $2)
    RETURNING user_id AS "userId", ${productName}_id AS "${productName}Id"
  `,

  remove: (productName: ProductName) => `
    DELETE FROM hookah.favorite_${productName}
    WHERE user_id = $1 AND ${productName}_id = $2
  `,
};
