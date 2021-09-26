// while in "edidMode", capitalize the category name so that it will match the value
// in the category arrays and show the correct value in the selection

export const capitalize = (cat: string | number | undefined) => {
  if (cat !== undefined) {
    return cat.toString().charAt(0).toUpperCase() + cat.toString().slice(1);
  }
  return;
};
