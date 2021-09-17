import { Fragment } from "react";
import Image from "next/image";

import { ProductProps } from "../../util/react-hooks/get-more-products";

interface Props {
  products: ProductProps[];
  isLoading: boolean;
  lastElementRef: (node: HTMLDivElement) => void;
}

export default function RenderSubCatImage(props: Props) {
  const { products, isLoading, lastElementRef } = props;

  return (
    <Fragment>
      <div>t-shirts</div>
      {products.map((p, index) => {
        let url = Object.values(p.imagesUrl)[0][0];
        let lastElem = index + 1 === products.length;
        return lastElem ? (
          <div ref={lastElementRef} key={index}>
            <Image src={url} width={400} height={400} alt={p.title} />
          </div>
        ) : (
          <div key={index}>
            <Image src={url} width={400} height={400} alt={p.title} />
          </div>
        );
      })}
      {isLoading && <h4>Loading shit load of data</h4>}
    </Fragment>
  );
}
