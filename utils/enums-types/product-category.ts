export enum MainCategory {
  men = "Men",
  women = "Women",
  kids = "Kids",
  accessories = "Accessories",
}
export const mainCatArray = Object.values(MainCategory);

export enum WomenCategory {
  jeans = "Jeans",
  shorts = "Shorts",
  dresses = "Dresses",
}
export const womenCatArray = Object.values(WomenCategory);

export enum MenCategory {
  // tops
  t_shirts = "T-shirts",
  shirts = "Shirts",
  coats = "Coats",
  blazers = "Blazers",
  // bottoms
  shorts = "Shorts",
  pants = "pants",
  jeans = "Jeans",
  // misc
  shoes = "Shoes",
  hats = "Hats",
  glasses = "Glasses",
}
export const menCatArray = Object.values(MenCategory);

export enum KidsCategory {
  Tshirts = "T-shirts",
  shorts = "Shorts",
}
export const kidsCatArray = Object.values(KidsCategory);
