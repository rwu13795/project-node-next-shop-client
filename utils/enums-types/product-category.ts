export enum MainCategory {
  women = "Women",
  men = "Men",
  kids = "Kids",
  accessories = "Accessories",
}
export const mainCatArray = Object.values(MainCategory);

///////////
// WOMEN //
///////////
export enum WomenCategory {
  // tops
  t_shirts = "T-shirts",
  blouses = "Blouses",
  coats = "Coats",
  hoodies = "Hoodies",
  // bottoms
  shorts = "Shorts",
  dresses = "Dresses",
  jeans = "Jeans",
  // accessories
  socks = "Socks",
  hats = "Hats",
  glasses = "Glasses",
}
export const womenCatArray = Object.values(WomenCategory);
export const womenMenuList = {
  tops: ["T-shirts", "Blouses", "Coats", "Hoodies"],
  bottoms: ["Shorts", "Dresses", "Jeans"],
  accessories: ["Socks", "Hats", "Glasses"],
};

/////////
// MEN //
/////////
export enum MenCategory {
  // tops
  t_shirts = "T-shirts",
  shirts = "Shirts",
  coats = "Coats",
  hoodies = "Hoodies",
  // bottoms
  shorts = "Shorts",
  pants = "Pants",
  jeans = "Jeans",
  // accessories
  socks = "Socks",
  hats = "Hats",
  glasses = "Glasses",
}
export const menCatArray = Object.values(MenCategory);
export const menMenuList = {
  tops: ["T-shirts", "Shirts", "Coats", "Hoodies"],
  bottoms: ["Shorts", "Pants", "Jeans"],
  accessories: ["Socks", "Hats", "Glasses"],
};

//////////
// KIDs //
//////////
export enum KidsCategory {
  // tops
  t_shirts = "T-shirts",
  sweaters = "Sweaters",
  Jackets = "Jackets",
  // bottoms
  shorts = "Shorts",
  pants = "Pants",
  jeans = "Jeans",
  // accessories
  socks = "Socks",
  hats = "Hats",
}
export const kidsCatArray = Object.values(KidsCategory);
export const kidsMenuList = {
  tops: ["T-shirts", "Sweaters", "Jackets"],
  bottoms: ["Shorts", "Pants", "Jeans"],
  accessories: ["Socks", "Hats"],
};
