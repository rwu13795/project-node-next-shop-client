import React, { Fragment, useState, CSSProperties, memo } from "react";
import Image from "next/image";

import { MainCategory } from "../../../utils/enums-types/product-category";
import Swiper_horizontal_NavButton_homePage from "./nav-button-horizontal";
import Slide_text_box from "./slide-text-box";

// UI //
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Grid, useMediaQuery } from "@mui/material";
import styles from "./__swiper.module.css";

SwiperCore.use([Pagination, Navigation]);

interface Props {
  srcProp: {
    large: string[];
    small: string[];
    x_small: string[];
    category: string;
  };
}

function Swiper_horizontal_homePage({ srcProp }: Props): JSX.Element {
  const { large, small, x_small, category } = srcProp;
  const [slideNum, setSlideNum] = useState<number>(1);

  const isSmall = useMediaQuery("(max-width: 765px)");

  const slide_x_small = {
    paddingTop: "0rem",
    width: "100vw",
    height: "100%",
    backgroundImage: `url('/background/${category.toLowerCase()}.jpg')`,
    backgroundSize: category === "Kids" ? "cover" : "contain",
    backgroundPosition: "center",
  } as CSSProperties;

  const onSlideChangeHandler = (e: SwiperCore) => {
    setSlideNum(e.realIndex + 1);
  };

  return (
    <Fragment>
      <Swiper
        // autoHeight={true} // the height of the swiper-wrapper that wraps the "slides"
        onSlideChange={onSlideChangeHandler}
        slidesPerView={1}
        spaceBetween={0}
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
        }}
      >
        {isSmall
          ? //////////////////
            // small screen //
            //////////////////
            small.map((src, index) => {
              return index === 0 && category !== "Accessories" ? (
                <SwiperSlide key={index} className={styles.horizontal_slide_1}>
                  <Grid item container style={slide_x_small}>
                    {x_small.map((src, index) => {
                      let top, left, width, height;
                      if (category === MainCategory.men) {
                        top = 2 + index * 8;
                        left = 6.5 + index * 14.5;
                        width = 95;
                        height = 440;
                      } else if (category === MainCategory.women) {
                        top = 2 + index * 11;
                        left = 10 + index * 16;
                        width = 130;
                        height = 480;
                      } else {
                        top = 3 + index * 13;
                        left = 10 + index * 20;
                        width = 250;
                        height = 1000;
                      }
                      return (
                        <div
                          key={index + src}
                          style={{
                            width: "20%",
                            maxWidth: `${width}px`,
                            position: "absolute",
                            top: `${top}vh`,
                            left: `${left}vw`,
                            backgroundColor: "black",
                          }}
                        >
                          <Image
                            src={src}
                            alt={src}
                            width={width}
                            height={height}
                            blurDataURL={src}
                            placeholder="blur"
                            // loading="eager"
                          />
                        </div>
                      );
                    })}
                  </Grid>
                  <Slide_text_box main_cat={category} slide_index={index} />
                </SwiperSlide>
              ) : (
                <SwiperSlide key={index} className={styles.horizontal_slide_2}>
                  <Image
                    className={styles.slide_image}
                    src={src}
                    alt={src}
                    layout="fill"
                    blurDataURL={src}
                    placeholder="blur"
                  />
                  <Slide_text_box main_cat={category} slide_index={index} />
                </SwiperSlide>
              );
            })
          : //////////////////
            // large screen //
            //////////////////
            large.map((src, index) => {
              return (
                <SwiperSlide
                  key={src + index}
                  className={styles.horizontal_slide_1}
                >
                  <Image
                    className={styles.slide_image}
                    src={src}
                    alt={src}
                    layout="fill"
                    blurDataURL={src}
                    placeholder="blur"
                  />
                  <Slide_text_box main_cat={category} slide_index={index} />
                </SwiperSlide>
              );
            })}

        <div className={styles.horizontal_navbar}>
          <Swiper_horizontal_NavButton_homePage
            slideNum={slideNum}
            total={srcProp.large.length}
          />
        </div>
      </Swiper>
    </Fragment>
  );
}

export default memo(Swiper_horizontal_homePage);
