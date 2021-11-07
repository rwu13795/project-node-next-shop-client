import Image from "next/image";
import { useState, Fragment, CSSProperties, MouseEvent } from "react";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// Swiper //
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// UI //
import { Grid, Box } from "@mui/material";
import styles from "./__images.module.css";

interface Props {
  currentColor: PageColorProps;
  activeThumbsImageHandler: (index: number) => void;
  activeImage: number;
  screenSize: string;
}

const nav_botton = {
  display: "flex",
  cursor: "pointer",
  color: "red",
  border: "red solid 2px",
} as CSSProperties;

export default function ImagesSwiper_thumbs_ProductDetail({
  currentColor,
  activeThumbsImageHandler,
  activeImage,
  screenSize,
}: Props): JSX.Element {
  return (
    <Box className={styles.vertical_thumbs_container}>
      <div className="thumbs-horizontal-prev-botton" style={nav_botton}>
        <Grid
          container
          justifyContent="center"
          className={styles.vertical_thumbs_nav_prev}
        >
          <Image src="/angel-left-thin.svg" alt="left" width={30} height={30} />
        </Grid>
      </div>
      <Swiper
        direction="vertical"
        id="detail_images_thumbs"
        spaceBetween={5}
        slidesPerView={4}
        watchSlidesProgress={true}
        navigation={{
          nextEl: ".thumbs-horizontal-next-botton",
          prevEl: ".thumbs-horizontal-prev-botton",
        }}
        className={styles.thumbs_swiper}
      >
        {currentColor.imageFiles.map((img, index) => {
          return (
            <SwiperSlide
              key={img}
              id={`abc${index}`}
              className={
                activeImage === index ? styles.thumb_active : styles.thumb
              }
              onMouseEnter={() => activeThumbsImageHandler(index)}
              onClick={() => activeThumbsImageHandler(index)}
            >
              <Image
                src={img}
                alt={img}
                // width={90}
                // height={100}
                layout="fill"
                className={styles.slide_image}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="thumbs-horizontal-next-botton" style={nav_botton}>
        <Grid
          container
          justifyContent="center"
          className={styles.vertical_thumbs_nav_next}
        >
          <Image
            src="/angel-right-thin.svg"
            alt="right"
            width={30}
            height={30}
          />
        </Grid>
      </div>
    </Box>
  );
}
