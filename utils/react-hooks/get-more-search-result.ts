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

export default function useGetMoreSearchResult(
  startProducts: PageProductProps[],
  pageNum: number,
  search: string
) {
  const ITEMS_PER_PAGE = 6;
  const client = browserClient();

  const [products, setProducts] = useState<PageProductProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // have to reset the products when the startProducts were changed
  // (when other sub-cat products are being rendered)
  useEffect(() => {
    setProducts(startProducts);
    setHasMore(startProducts.length >= ITEMS_PER_PAGE);
  }, [startProducts]);

  const fetchMoreData = useCallback(async () => {
    if (hasMore) {
      try {
        const { data } = await client.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/products/search-product?search=${search}&page=${pageNum}`
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
      setIsLoading(true);
      fetchMoreData();
      setIsLoading(false);
      return;
    }
  }, [pageNum]);

  return { isLoading, products, hasMore };
}
