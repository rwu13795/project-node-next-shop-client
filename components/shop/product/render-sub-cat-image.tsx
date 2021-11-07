import { Dispatch, Fragment, SetStateAction, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";

interface Props {
  // products: PageProductProps[];
  // isLoading: boolean;
  // lastElementRef: (node: HTMLDivElement) => void;
  startProducts: PageProductProps[];
  sub_cat: string;
  main_cat: string;
}

export default function RenderSubCatImage({
  startProducts,
  main_cat,
  sub_cat,
}: Props) {
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  const [pageNum, setPageNum] = useState<number>(1);
  const { isLoading, error, products, hasMore } = useGetMoreProducts(
    pageNum,
    startProducts,
    main_cat,
    sub_cat
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useLastElementRef(
    isLoading,
    observer,
    hasMore,
    setPageNum
  );

  console.log(products);

  return (
    <Fragment>
      {isRedirecting && (
        <div>
          <CircularProgress />
        </div>
      )}
      <div>t-shirts</div>
      {products.map((p, index) => {
        let url = p.colorPropsList[0].imageFiles[0];
        let lastElem = index + 1 === products.length;
        return lastElem ? (
          <div ref={lastElementRef} key={index}>
            <RenderImage p={p} url={url} setIsRedirecting={setIsRedirecting} />
          </div>
        ) : (
          <div key={index}>
            <RenderImage p={p} url={url} setIsRedirecting={setIsRedirecting} />
          </div>
        );
      })}
      {isLoading && (
        <div>
          <h4>Loading shit load of data</h4>
          <CircularProgress />
        </div>
      )}
    </Fragment>
  );
}

const RenderImage = ({
  p,
  url,
  setIsRedirecting,
}: {
  p: PageProductProps;
  url: string;
  setIsRedirecting: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <Link
      href={`/shop/product-detail/${p.productInfo.main_cat}-${p.productInfo.sub_cat}-${p._id}`}
    >
      <a
        onClick={() => {
          setIsRedirecting(true);
        }}
      >
        <Image src={url} width={400} height={400} alt={p.productInfo.title} />
      </a>
    </Link>
  );
};
