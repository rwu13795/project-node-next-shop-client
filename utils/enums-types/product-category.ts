export enum MainCategory {
  women = "Women",
  men = "Men",
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
export const womenMenuList = {
  tops: ["T-shirts", "Blouses", "Coats", "Hoodies"],
  bottoms: ["Shorts", "Dresses", "Jeans"],
  accessories: ["Socks", "Hats", "Glasses"],
};

export enum MenCategory {
  // tops
  t_shirts = "T-shirts",
  shirts = "Shirts",
  coats = "Coats",
  blazers = "Hoodies",
  // bottoms
  shorts = "Shorts",
  pants = "Pants",
  jeans = "Jeans",
  // misc
  shoes = "Socks",
  hats = "Hats",
  glasses = "Glasses",
}
export const menCatArray = Object.values(MenCategory);
export const menMenuList = {
  tops: ["T-shirts", "Shirts", "Coats", "Hoodies"],
  bottoms: ["Shorts", "Pants", "Jeans"],
  accessories: ["Socks", "Hats", "Glasses"],
};

export enum KidsCategory {
  Tshirts = "T-shirts",
  shorts = "Shorts",
}
export const kidsCatArray = Object.values(KidsCategory);
export const kidsMenuList = {
  tops: ["T-shirts", "Sweaters", "Jackets"],
  bottoms: ["Shorts", "Pants", "Jeans"],
  accessories: ["Socks", "Hats"],
};
