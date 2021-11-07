import Image from "next/image";
import { useState, Fragment, useRef, CSSProperties } from "react";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";
import ImagesSwiper_ProductDetail from "./swiper";
import ImagesSwiper_thumbs_ProductDetail from "./thumbs";

// Swiper //
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/thumbs";
import SwiperCore, { Navigation } from "swiper";

// UI //
import { Grid, Box, Hidden } from "@mui/material";
import styles from "./__images.module.css";

SwiperCore.use([Navigation]);

interface Props {
  currentColor: PageColorProps;
}

export default function ProductDetailImages({
  currentColor,
}: Props): JSX.Element {
  const [activeImage, setActiveImage] = useState<number>(0);

  const activeThumbsImageHandler = (index: number) => {
    let elem: any = document.getElementById(
      "images_swiper_large_product_detail"
    );
    let swiper = elem.swiper;
    swiper.slideTo(index, 250);
    setActiveImage(index);
  };

  const onSlideChangeHandler = (swiper: SwiperCore) => {
    // let images_thumbs = document.getElementById("detail_images_thumbs");
    // images_thumbs.swiper.slideTo(swiper.realIndex, 250);
    setActiveImage(swiper.realIndex);
  };

  return (
    <Fragment>
      <Grid
        container
        justifyContent="row"
        wrap="nowrap"
        className={styles.images_container}
      >
        <ImagesSwiper_thumbs_ProductDetail
          activeThumbsImageHandler={activeThumbsImageHandler}
          activeImage={activeImage}
          currentColor={currentColor}
          screenSize={"large"}
        />

        <ImagesSwiper_ProductDetail
          onSlideChangeHandler={onSlideChangeHandler}
          currentColor={currentColor}
          screenSize={"large"}
        />
      </Grid>
    </Fragment>
  );
}

/*
horizontal thumbs

<Swiper
          id="detail_images_thumbs"
          spaceBetween={5}
          slidesPerView={4}
          navigation={true}
          watchSlidesProgress={true}
          style={{
            display: "block",
            width: "50vw",
            height: "100%",
            backgroundColor: "silver",
          }}
        >
          {currentColor.imageFiles.map((img, index) => {
            return (
              <SwiperSlide
                id={`abc${index}`}
                key={img}
                className={
                  activeImage === index
                    ? styles.thumbs_swiper_active
                    : styles.thumbs_swiper
                }
                onMouseEnter={() => activeThumbsImageHandler(index)}
                onClick={() => activeThumbsImageHandler(index)}
              >
                <Image src={img} alt={img} width={100} height={100} />
              </SwiperSlide>
            );
          })}
        </Swiper>

*/
