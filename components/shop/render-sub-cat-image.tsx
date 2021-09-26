import { Fragment, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { PageProductProps } from "../../utils/react-hooks/get-more-products";

interface Props {
  products: PageProductProps[];
  isLoading: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
}

export default function RenderSubCatImage(props: Props) {
  const { products, isLoading, lastElementRef } = props;
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);

  return (
    <Fragment>
      {isRedirecting && <div>Loading product</div>}
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
      {isLoading && <h4>Loading shit load of data</h4>}
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
  setIsRedirecting: any;
}) => {
  return (
    <Link href={`/shop/${p._id}-${p.productInfo.main_cat}`}>
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
