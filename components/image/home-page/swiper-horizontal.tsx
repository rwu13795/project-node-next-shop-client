import React, { Fragment, useState } from "react";
import Image from "next/image";

import { Grid, Box } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./__swiper.module.css";
import { MainCategory } from "../../../utils/enums-types/product-category";
import Swiper_horizontal_NavButton_homePage from "./nav-button-horizontal";

SwiperCore.use([Pagination, Navigation]);

interface Props {
  srcProp: { md: string[] };
}

export default function Swiper_horizontal_homePage({
  srcProp,
}: Props): JSX.Element {
  const [slideNum, setSlideNum] = useState<number>(1);

  const onSlideChangeHandler = (e: SwiperCore) => {
    setSlideNum(e.realIndex + 1);
  };

  return (
    <Fragment>
      <Swiper
        // autoHeight={true} // the height of the swiper-wrapper that wraps the "slides"
        onSlideChange={onSlideChangeHandler}
        slidesPerView={1}
        spaceBetween={50}
        loop={true}
        navigation={{
          nextEl: ".swiper-horizontal-next-botton",
          prevEl: ".swiper-horizontal-prev-botton",
        }}
        className="mySwiper"
        style={{
          position: "relative",
          display: "block",
          width: "100vw",
          height: "100%",
          backgroundColor: "teal",
        }}
        // wrapperClass={styles.swiper_custom_wrapper}
      >
        <div></div>
        {srcProp.md.map((src, index) => {
          return index === 0 ? (
            <SwiperSlide
              key={index}
              style={{
                position: "relative",
                display: "block",
                width: "100vw",
                height: "100%",

                // objectFit: "cover",
              }}
            >
              <Grid item container style={slide_small.slide}>
                {sm.map((src, index) => {
                  let top, left, width, height;
                  top = 7 + index * 11;
                  left = 10 + index * 16;
                  width = 130;
                  height = 480;
                  return (
                    <Box
                      key={index + src}
                      style={{
                        width: "20%",
                        maxWidth: `${width}px`,
                        position: "absolute",
                        top: `${top}%`,
                        left: `${left}%`,
                        backgroundColor: "black",
                      }}
                      sx={{ boxShadow: 15 }}
                    >
                      <Image
                        src={src}
                        alt={src}
                        width={width}
                        height={height}
                        // blurDataURL={prop.sm_blur[index]}
                        // placeholder="blur"
                        loading="eager"
                      />
                    </Box>
                  );
                })}
              </Grid>
            </SwiperSlide>
          ) : (
            <SwiperSlide
              key={src + index}
              style={{
                position: "relative",
                display: "block",
                width: "100vw",
                height: "100%",
                // objectFit: "cover",
              }}
            >
              <Image
                className={styles.slide_image}
                src={src}
                alt={src}
                layout="fill"
                // width={3000}
                // height={2500}
                // blurDataURL={prop.md}
                // placeholder="blur"
                // loading="eager"
              />
            </SwiperSlide>
          );
          // );
        })}
        <div className={styles.horizontal_navbar}>
          <Swiper_horizontal_NavButton_homePage
            slideNum={slideNum}
            total={srcProp.md.length}
          />
        </div>
      </Swiper>
    </Fragment>
  );
}

const sm = [
  "/home/women-sm-1.jpg",
  "/home/women-sm-2.jpg",
  "/home/women-sm-3.jpg",
  "/home/women-sm-4.jpg",
  "/home/women-sm-5.jpg",
];

import { CSSProperties } from "react";

export const slide_small = {
  title: {
    position: "absolute",
    top: "13%",
    left: "60vw",
    fontSize: "3.5vw",
  } as CSSProperties,
  slide: {
    paddingTop: "0rem",
    // margin: "-2 5vh 10vw 5vh",
    width: "100vw",
    height: "100%",
    // minHeight: "100vh",
    backgroundImage:
      "url('/background/abstract_rainbow_colors-wallpaper-1920x1200.jpg')",
    backgroundSize: "contain, cover",
  } as CSSProperties,
};
