import { register, login } from "./register";
import { saveProduct } from "./product";
import { saveCoalComment, saveTobaccoComment } from "./comment";
import { saveFavoriteTobacco, saveFavoriteCoal } from "./favorite";
import { saveTobaccoRating, saveCoalRating } from "./rating";

export default {
  register,
  login,
  saveCoalComment,
  saveTobaccoComment,
  saveProduct,
  saveFavoriteTobacco,
  saveFavoriteCoal,
  saveTobaccoRating,
  saveCoalRating,
};
