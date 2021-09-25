import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";

import { PageProductProps } from "../../util/react-hooks/get-more-products";

interface Props {
  products: PageProductProps[];
  isLoading: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
}

export default function RenderSubCatImage(props: Props) {
  const { products, isLoading, lastElementRef } = props;

  return (
    <Fragment>
      <div>t-shirts</div>
      {products.map((p, index) => {
        let url = p.colorPropsList[0].imageFiles[0];
        let lastElem = index + 1 === products.length;
        return lastElem ? (
          <div ref={lastElementRef} key={index}>
            <RenderImage p={p} url={url} />
          </div>
        ) : (
          <div key={index}>
            <RenderImage p={p} url={url} />
          </div>
        );
      })}
      {isLoading && <h4>Loading shit load of data</h4>}
    </Fragment>
  );
}

const RenderImage = ({ p, url }: { p: PageProductProps; url: string }) => {
  return (
    <Link href={`/shop/${p._id}-${p.productInfo.main_cat}`}>
      <a>
        <Image src={url} width={400} height={400} alt={p.productInfo.title} />
      </a>
    </Link>
  );
};
