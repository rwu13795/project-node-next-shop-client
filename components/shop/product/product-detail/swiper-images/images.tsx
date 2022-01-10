import dynamic from "next/dynamic";
import { useState, Fragment, memo } from "react";
import { useMediaQuery } from "react-responsive";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";
import Swiper_product_detail_images from "./swiper";
import Swiper_thumbs_product_detail_images from "./thumbs";

// Swiper //
import SwiperCore, { Navigation } from "swiper";

// UI //
import { Grid } from "@mui/material";

SwiperCore.use([Navigation]);

interface Props {
  currentColor: PageColorProps;
  previewImage: string;
}

function ProductDetailImages({
  currentColor,
  previewImage,
}: Props): JSX.Element {
  const [activeImage, setActiveImage] = useState<number>(0);

  const isLarge = useMediaQuery({ query: "(min-width: 1080px)" });
  const isMedium = useMediaQuery({
    query: "(max-width: 1079px) and (min-width: 765px)",
  });
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  const activeThumbsImageHandler = (index: number, screenSize: string) => {
    let elem: any;
    if (screenSize === "large") {
      elem = document.getElementById("images_swiper_large_product_detail");
    } else {
      elem = document.getElementById("images_swiper_medium_product_detail");
    }
    let swiper = elem.swiper;
    swiper.slideTo(index, 250);
    setActiveImage(index);
  };

  const onSlideChangeHandler = (swiper: SwiperCore) => {
    setActiveImage(swiper.realIndex);
  };

  return (
    <Fragment>
      {isLarge && (
        <Grid container justifyContent="row" wrap="nowrap">
          <Swiper_thumbs_product_detail_images
            activeThumbsImageHandler={activeThumbsImageHandler}
            activeImage={activeImage}
            currentColor={currentColor}
            screenSize={"large"}
          />
          <Swiper_product_detail_images
            onSlideChangeHandler={onSlideChangeHandler}
            currentColor={currentColor}
            screenSize={"large"}
            previewImage={previewImage}
          />
        </Grid>
      )}
      {isMedium && (
        <Grid container justifyContent="column">
          <Swiper_product_detail_images
            onSlideChangeHandler={onSlideChangeHandler}
            currentColor={currentColor}
            screenSize={"medium"}
            previewImage={previewImage}
          />
          <Swiper_thumbs_product_detail_images
            activeThumbsImageHandler={activeThumbsImageHandler}
            activeImage={activeImage}
            currentColor={currentColor}
            screenSize={"small"}
          />
        </Grid>
      )}
      {isSmall && (
        <Grid>
          <Swiper_product_detail_images
            onSlideChangeHandler={onSlideChangeHandler}
            currentColor={currentColor}
            screenSize={"small"}
            previewImage={previewImage}
          />
        </Grid>
      )}
    </Fragment>
  );
}

// the "useMediaQuery" will cause error while using it with the NextJS ServerSideRendering
// use the "dynamic" function to call the component, this will make this
// component to be rendered on "client site" only

// OR, I could use the "useMediaQuery" from the "MUI", which can be injected in the
// server-side rendering
export default memo(
  dynamic(() => Promise.resolve(ProductDetailImages), {
    ssr: false,
  })
);
