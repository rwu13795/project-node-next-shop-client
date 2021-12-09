import { GetServerSidePropsContext, NextPage } from "next";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import serverClient from "../../utils/axios-client/server-client";
import { PageProductProps } from "../../utils/react-hooks/get-more-products";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { selectOneItmePerRow } from "../../utils/redux-store/shopSlice";
import ProductPreview from "../../components/image/product-preview/preview";
import useGetMoreSearchResult from "../../utils/react-hooks/get-more-search-result";
import useLastElementRef from "../../utils/react-hooks/last-elem-ref";

// UI //
import { Grid } from "@mui/material";
import styles from "./__search-result.module.css";

interface PageProps {
  products: PageProductProps[];
  search: string;
}

const SearchResult: NextPage<PageProps> = ({
  products: startProducts,
  search,
}) => {
  const dispatch = useDispatch();
  const oneItemPerRow = useSelector(selectOneItmePerRow);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const [pageNum, setPageNum] = useState<number>(1);

  useEffect(() => {
    setPageNum(1);
  }, [search]);

  const { isLoading, products, hasMore } = useGetMoreSearchResult(
    startProducts,
    pageNum,
    search
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useLastElementRef(
    isLoading,
    observer,
    hasMore,
    undefined,
    setPageNum
  );

  return (
    <main className={styles.main_container}>
      <div className={styles.main_title}>
        SEARCH RESULT FOR: {`"${search}"`}
      </div>
      <div className={styles.items_body}>
        {products.map((p, index) => {
          let lastElem = index + 1 === products.length;
          return lastElem ? (
            <Grid
              item
              container
              className={styles.items_grid}
              md={4}
              sm={oneItemPerRow ? 12 : 6}
              xs={oneItemPerRow ? 12 : 6}
              ref={lastElementRef}
              key={index}
            >
              <ProductPreview
                productId={p._id}
                colorPropsList={p.colorPropsList}
                productInfo={p.productInfo}
              />
            </Grid>
          ) : (
            <Grid
              item
              container
              className={styles.items_grid}
              md={4}
              sm={oneItemPerRow ? 12 : 6}
              xs={oneItemPerRow ? 12 : 6}
              key={index}
            >
              <ProductPreview
                productId={p._id}
                colorPropsList={p.colorPropsList}
                productInfo={p.productInfo}
              />
            </Grid>
          );
        })}
      </div>
    </main>
  );
};

export default SearchResult;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const search = context.query.search as string;

  const client = serverClient(context);

  const { data }: { data: PageProps } = await client.get(
    `http://localhost:5000/api/products/search-product?search=${search}&page=1`
  );

  return {
    props: {
      search,
      products: data.products,
      filter_view: true,
      page: "search",
    },
  };
}
