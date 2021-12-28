import Image from "next/image";
import { useState, Fragment, CSSProperties, MouseEvent, memo } from "react";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// Swiper //
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// UI //
import { Grid, Box } from "@mui/material";
import styles from "./__thumbs.module.css";

interface Props {
  currentColor: PageColorProps;
  activeThumbsImageHandler: (index: number, screenSize: string) => void;
  activeImage: number;
  screenSize: string;
}

function Swiper_thumbs_product_detail_images({
  currentColor,
  activeThumbsImageHandler,
  activeImage,
  screenSize,
}: Props): JSX.Element {
  let container: string,
    thumbs_swiper: string,
    thumb: string,
    thumb_active: string,
    nav_next: string,
    nav_prev: string;
  if (screenSize === "large") {
    container = styles.thumbs_container_vertical;
    thumbs_swiper = styles.thumbs_swiper_vertical;
    thumb = styles.thumb_vertical;
    thumb_active = styles.thumb_active_vertical;
    nav_next = styles.thumbs_nav_next_vertical;
    nav_prev = styles.thumbs_nav_prev_vertical;
  } else {
    container = styles.thumbs_container_horizontal;
    thumbs_swiper = styles.thumbs_swiper_horizontal;
    thumb = styles.thumb_horizontal;
    thumb_active = styles.thumb_active_horizontal;
    nav_next = styles.thumbs_nav_next_horizontal;
    nav_prev = styles.thumbs_nav_prev_horizontal;
  }

  const nav_botton = {
    display: "flex",
    cursor: "pointer",
  } as CSSProperties;

  const imageCount = currentColor.imageCount;

  return (
    <Box className={container}>
      {imageCount > 4 && (
        <div className="thumbs-prev-btn-product-detail" style={nav_botton}>
          <Grid container justifyContent="center" className={nav_prev}>
            <Image
              src="/angel-left-thin.svg"
              alt="left"
              width={30}
              height={30}
            />
          </Grid>
        </div>
      )}

      <Swiper
        direction={screenSize === "large" ? "vertical" : "horizontal"}
        id="detail_images_thumbs"
        spaceBetween={15}
        slidesPerView={4}
        watchSlidesProgress={true}
        navigation={{
          nextEl: ".thumbs-next-btn-product-detail",
          prevEl: ".thumbs-prev-btn-product-detail",
        }}
        className={thumbs_swiper}
      >
        {currentColor.imageFiles.map((img, index) => {
          return (
            <SwiperSlide
              key={img}
              onMouseEnter={() => activeThumbsImageHandler(index, screenSize)}
              onClick={() => activeThumbsImageHandler(index, screenSize)}
              className={activeImage === index ? thumb_active : thumb}
            >
              <Image
                src={img}
                alt={img}
                layout="fill"
                className={styles.slide_image}
                // since all the images have different size and ratio, it is impossible
                // to fit the image inside the box perfectly.
                // if the size of all images is the same, the images can be easily fit inside
                // the box and next-image can resize the image automatically
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
      {imageCount > 4 && (
        <div className="thumbs-next-btn-product-detail" style={nav_botton}>
          <Grid container justifyContent="center" className={nav_next}>
            <Image
              src="/angel-right-thin.svg"
              alt="right"
              width={30}
              height={30}
            />
          </Grid>
        </div>
      )}
    </Box>
  );
}

export default memo(Swiper_thumbs_product_detail_images);
