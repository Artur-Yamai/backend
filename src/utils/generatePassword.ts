export const generatePassword = (): string => {
  const passLength = 12;
  const charset =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";

  let pass = "";
  for (let i = 0; i < passLength; ++i) {
    pass += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  return pass;
};
