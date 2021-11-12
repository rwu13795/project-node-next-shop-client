import { Fragment, memo } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

import ProductReviews from "./reviews";
import ReviewsCollapseBox from "./reviews-collapse-box";
import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

interface Props {
  reviews: Reviews;
  page?: string;
}

function ReviewsWrapper({ reviews, page }: Props): JSX.Element {
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  return (
    <Fragment>
      {isSmall ? (
        <ReviewsCollapseBox reviews={reviews} page={page} />
      ) : (
        <ProductReviews reviews={reviews} page={page} />
      )}
    </Fragment>
  );
}

export default memo(
  dynamic(() => Promise.resolve(ReviewsWrapper), {
    ssr: false,
  })
);
