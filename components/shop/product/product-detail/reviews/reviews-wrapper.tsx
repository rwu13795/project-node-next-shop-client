import React, { Fragment, memo } from "react";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

import ProductReviews from "./reviews";
import ReviewsCollapseBox from "./reviews-collapse-box";
import { Reviews } from "../../../../../pages/shop/product-detail/[product_id]";

interface Props {
  reviewDoc: Reviews;
  setOpenAddReivewModal: React.Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  page?: string;
  refreshReviews?: () => Promise<void>;
}

function ReviewsWrapper({
  reviewDoc,
  setOpenAddReivewModal,
  refreshReviews,
  openAddReivewModal,
  page,
}: Props): JSX.Element {
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  return (
    <Fragment>
      {isSmall ? (
        <ReviewsCollapseBox
          reviewDoc={reviewDoc}
          page={page}
          setOpenAddReivewModal={setOpenAddReivewModal}
          refreshReviews={refreshReviews}
          openAddReivewModal={openAddReivewModal}
        />
      ) : (
        <ProductReviews
          reviewDoc={reviewDoc}
          page={page}
          setOpenAddReivewModal={setOpenAddReivewModal}
          refreshReviews={refreshReviews}
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
