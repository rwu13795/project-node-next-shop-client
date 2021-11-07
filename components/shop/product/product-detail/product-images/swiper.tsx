import Image from "next/image";
import { useState, Fragment, CSSProperties, MouseEvent } from "react";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// Swiper //
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SwiperCore from "swiper";

// UI //
import { Grid, Box } from "@mui/material";
import styles from "./__images.module.css";

interface Props {
  currentColor: PageColorProps;
  onSlideChangeHandler: (swiper: SwiperCore) => void;
  screenSize: string;
}

export default function ImagesSwiper_ProductDetail({
  currentColor,
  onSlideChangeHandler,
  screenSize,
}: Props): JSX.Element {
  const zoomInHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    // there is no offsetX/Y in the JSX event, need to

    let posX = e.nativeEvent.offsetX;
    let posY = e.nativeEvent.offsetY;
    // console.log(e);
    console.log("x " + posX + " y " + posY);

    let width = e.currentTarget.offsetWidth;
    e.currentTarget.style.backgroundSize = `${width * 2}px`;
    // // console.dir(e.target);

    e.currentTarget.style.backgroundPosition =
      -posX * 1 + "px " + -posY * 1 + "px";

    // console.log(e.target.style.backgroundPosition);
  };

  const zoomOutHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.currentTarget.style.backgroundPosition = "0px 0px";
    e.currentTarget.style.backgroundSize = "cover";
  };

  return (
    <Fragment>
      <Swiper
        id="images_swiper_large_product_detail"
        slidesPerView={1}
        spaceBetween={50}
        className={styles.main_swpier}
        onSlideChange={onSlideChangeHandler}
      >
        {currentColor.imageFiles.map((img) => {
          return (
            <SwiperSlide key={img} className={styles.main_swiper_slide}>
              <div
                id="bg_image"
                className={styles.main_swpier_image}
                style={{
                  background: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                onMouseMove={(e) => zoomInHandler(e)}
                onMouseOut={(e) => zoomOutHandler(e)}
              ></div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Fragment>
  );
}
