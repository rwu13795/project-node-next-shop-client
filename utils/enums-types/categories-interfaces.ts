import { PageProductProps } from "../react-hooks/get-more-products";

interface FilterSizes {
  small: number;
  medium: number;
  large: number;
  [size: string]: number;
}

interface FilterColors {
  White: number;
  Silver: number;
  Gray: number;
  Black: number;
  Red: number;
  Orange: number;
  Brown: number;
  Maroon: number;
  Yellow: number;
  Olive: number;
  Lime: number;
  Green: number;
  Aqua: number;
  Teal: number;
  Blue: number;
  Navy: number;
  Pink: number;
  Fuchsia: number;
  Purple: number;
  [color: string]: number;
}

export interface FilterStats {
  main_cat: string;
  sub_cat: string;
  sizes: FilterSizes;
  colors: FilterColors;
  matchingTotal: number;
}

export interface SubCat_PageProps {
  products: PageProductProps[];
  filterStats: FilterStats;
  sub_cat: string;
  main_cat: string;
}

export interface MainCat_PageProps {
  products: {
    cat_1: PageProductProps[];
    cat_2: PageProductProps[];
    cat_3: PageProductProps[];
    cat_4: PageProductProps[];
  };
  subCatTitles: string[];
  main_cat: string;
}
