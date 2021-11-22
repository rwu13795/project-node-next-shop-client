/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import { RequestParams } from "../../components/shop/product/sub-cat-list";
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
  params: RequestParams,
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

  const ITEMS_PER_PAGE = 6;

  const client = browserClient();

  const axios_params = {
    page: params.pageNum,
    filter: {
      sizes: Array.from(params.filter.sizes),
      colors: Array.from(params.filter.colors),
      priceSort: -1,
    },
  };

  const fetchMoreData = useCallback(
    async (params) => {
      if (hasMore) {
        try {
          const { data } = await client.get(
            `http://localhost:5000/api/products/${main_cat}/${sub_cat}`,
            { params }
          );
          setHasMore(data.products.length >= ITEMS_PER_PAGE);

          setProducts((prev) => [...prev, ...data.products]);
        } catch (err) {
          console.log("Error in useGetMoreProducts ", err);
        }
      }
    },
    [hasMore]
  );

  // when the filter is on, set the "hasMore" to true again, to generate the
  // new "fetchMoreData" callback
  useEffect(() => {
    if (params.pageNum === 1 && params.filtering) {
      setHasMore(true);
      setProducts([]);
    }
  }, [params]);
  // have to use another "useEffect" here, because after setting setHasMore(true) in the
  // "useEffect" above, it does not feed the "fetchMoreData" with the new "hasMore"
  // immediately, the new "hasMore" will only be passed to the "fetchMoreData" in a new
  // render cycle.
  useEffect(() => {
    // only fetch the page-1 when the filter was used, so that the server-side-rendering
    // page-1 won't be fetched again.
    if (hasMore && params.filtering && params.pageNum === 1) {
      fetchMoreData(axios_params);
    }
  }, [hasMore, params, fetchMoreData]);

  // normal fetching cycle
  useEffect(() => {
    if (params.pageNum > 1) {
      setIsLoading(true);
      fetchMoreData(axios_params);
      setError(false);
      setIsLoading(false);
      return;
    }
  }, [fetchMoreData, params]);

  console.log("in get more hasMore", hasMore);

  return { isLoading, error, products, hasMore };
}
