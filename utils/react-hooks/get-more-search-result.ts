/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, memo } from "react";
import { useDispatch } from "react-redux";
import { RequestParams } from "../../components/shop/product/sub-cat-list";
import browserClient from "../../utils/axios-client/browser-client";
import { FilterStats } from "../enums-types/categories-interfaces";
import { setProductFiltering } from "../redux-store/shopSlice";

export interface PageColorProps {
  imageFiles: string[];
  colorName: string;
  colorCode: string;
  sizes: { [name: string]: number };
  imageCount: number;
}

export interface PageProductInfo {
  title: string;
  main_cat: string;
  sub_cat: string;
  price: number;
  description?: string;
}

export interface PageProductProps {
  _id: string;
  productInfo: PageProductInfo;
  colorPropsList: PageColorProps[];
}

export default function useGetMoreSearchResult(
  startProducts: PageProductProps[],
  pageNum: number,
  search: string
) {
  const ITEMS_PER_PAGE = 6;
  const client = browserClient();

  const [products, setProducts] = useState<PageProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //   const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // have to reset the products when the startProducts were changed
  // (when other sub-cat products are being rendered)
  useEffect(() => {
    setProducts(startProducts);
    setHasMore(startProducts.length >= ITEMS_PER_PAGE);
  }, [startProducts]);

  ////////
  console.log("pageNum in get more ---->", pageNum);

  const fetchMoreData = useCallback(async () => {
    if (hasMore) {
      try {
        const { data } = await client.get(
          `http://localhost:5000/api/products/search-product?search=${search}&page=${pageNum}`
        );

        console.log(
          "data.products in get more",
          data.products,
          "pageNum",
          pageNum
        );

        setHasMore(data.products.length >= ITEMS_PER_PAGE);
        setProducts((prev) => [...prev, ...data.products]);
      } catch (err) {
        console.log("something went wrong in fetching! ", err);
      }
    }
  }, [hasMore, search, pageNum]);

  useEffect(() => {
    if (pageNum > 1) {
      console.log("fetching more");
      setIsLoading(true);
      fetchMoreData();
      setIsLoading(false);
      return;
    }
  }, [pageNum]);

  return { isLoading, products, hasMore };
}
