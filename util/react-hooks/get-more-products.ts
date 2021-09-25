/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import browserClient from "../axios-client/browser-client";

export interface PageColorProps {
  imageFiles: string[];
  colorName?: string;
  colorCode?: string;
  sizes?: { [name: string]: number };
  imageCount?: number;
}

export interface PageProductProps {
  _id: string;
  productInfo: {
    title: string;
    main_cat: string;
    sub_cat?: string;
    price?: number;
    description?: string;
  };
  colorPropsList: PageColorProps[];
}

function useGetMoreProducts(
  pageNum: number,
  startProducts: PageProductProps[],
  main_cat: string,
  sub_cat: string
) {
  const [products, setProducts] = useState<PageProductProps[]>(startProducts);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const ITEMS_PER_PAGE = 4;

  const client = browserClient();

  const fetchMoreData = useCallback(async () => {
    if (hasMore) {
      try {
        const { data } = await client.get(
          `http://localhost:5000/api/products/${main_cat}/${sub_cat}?page=${pageNum}`
        );
        console.log("page", pageNum);
        setHasMore(data.products.length >= ITEMS_PER_PAGE);
        setProducts((prev) => [...prev, ...data.products]);
      } catch (err) {
        console.log("Error in useGetMoreProducts ", err);
      }
    }
  }, [pageNum, hasMore]);

  useEffect(() => {
    if (pageNum > 1) {
      setIsLoading(true);
      fetchMoreData();
      setError(false);
      setIsLoading(false);
    }
  }, [fetchMoreData, pageNum]);

  return { isLoading, error, products, hasMore };
}

export default useGetMoreProducts;
