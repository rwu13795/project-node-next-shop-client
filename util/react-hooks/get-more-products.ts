/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import browserClient from "../axios-client/browser-client";

export interface ProductProps {
  title: string;
  imagesUrl: { [color: string]: string[] };
}

function useGetMoreProducts(
  pageNum: number,
  startProducts: ProductProps[],
  main_cat: string,
  sub_cat: string
) {
  const [products, setProducts] = useState<ProductProps[]>(startProducts);
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
