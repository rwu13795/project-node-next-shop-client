/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import browserClient from "../../utils/axios-client/browser-client";

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

export default function useGetMoreProducts(
  pageNum: number,
  startProducts: PageProductProps[],
  main_cat: string,
  sub_cat: string
) {
  const [products, setProducts] = useState<PageProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  useEffect(() => {
    setProducts(startProducts);
  }, []);

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

  console.log("in get more", hasMore);

  return { isLoading, error, products, hasMore };
}
