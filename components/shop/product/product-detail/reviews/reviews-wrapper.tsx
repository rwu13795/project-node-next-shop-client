import React, { Fragment, memo } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

import ProductReviews from "./reviews";
import ReviewsCollapseBox from "./reviews-collapse-box";
import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

interface Props {
  reviews: Reviews;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  page?: string;
}

function ReviewsWrapper({
  reviews,
  setOpenAddReivewModal,
  openAddReivewModal,
  page,
}: Props): JSX.Element {
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  return (
    <Fragment>
      {isSmall ? (
        <ReviewsCollapseBox
          reviews={reviews}
          page={page}
          setOpenAddReivewModal={setOpenAddReivewModal}
          openAddReivewModal={openAddReivewModal}
        />
      ) : (
        <ProductReviews
          reviews={reviews}
          page={page}
          setOpenAddReivewModal={setOpenAddReivewModal}
          openAddReivewModal={openAddReivewModal}
        />
      )}
    </Fragment>
  );
}

export default memo(
  dynamic(() => Promise.resolve(ReviewsWrapper), {
    ssr: false,
  })
);
