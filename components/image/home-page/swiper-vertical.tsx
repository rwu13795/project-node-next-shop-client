import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import Image from "next/image";

import { Grid } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { MainCategory } from "../../../utils/enums-types/product-category";

import Swiper_home from "../home-page-1/swiper";
import { setLockScrollBar } from "../../../utils/redux-store/layoutSlice";
import { useDispatch } from "react-redux";
import { CSSProperties } from "react-transition-group/node_modules/@types/react";

import styles from "./__swiper-homePage.module.css";

SwiperCore.use([Pagination, Navigation, Mousewheel]);

export interface ImagePorp_swiper {
  category: string;
  md: string;
  sm: string[];
  sm_blur: string[];
}

interface Props {
  setSlideEnd: Dispatch<SetStateAction<boolean>>;
}

export default function Swiper_homePage_vertical({
  setSlideEnd,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  // NOTE //
  /* After reaching to the last slide, if the Swiper need to be unmounted, it has
    to wait for a bit, because the last slide might still be loading the CSS. and 
    unmounting it at the moment will cause error
  */
  const reachEndHandler = () => {
    setTimeout(() => setSlideEnd(true), 500);
  };

  return (
    <Fragment>
      <Swiper
        className="mySwiper"
        onSlideChange={() => dispatch(setLockScrollBar(true))}
        onReachEnd={reachEndHandler}
        mousewheel={{
          releaseOnEdges: true,
        }}
        pagination={{
          clickable: true,
        }}
        edgeSwipeDetection={true}
        spaceBetween={0}
        direction="vertical"
        slidesPerView={1}
        style={swiperStyle}
      >
        {imageProps.map((prop, index) => {
          return (
            <SwiperSlide style={swiperStyle} key={index}>
              <Grid
                container
                direction="column"
                wrap="nowrap"
                justifyContent="center"
                alignItems="center"
                style={{
                  height: "100%",
                  minHeight: "50vh",
                  marginBottom: "10vw",
                }}
              >
                <Grid
                  item
                  style={{
                    maxHeight: "80vh",
                    maxWidth: "50vh",
                    marginBottom: "10vw",
                  }}
                >
                  <Image
                    className={styles.slide_image}
                    src={prop.md}
                    alt={prop.category}
                    layout="fill"
                    // width={1000}
                    // height={850}
                    blurDataURL={prop.md}
                    placeholder="blur"
                    loading="eager"
                  />
                </Grid>
              </Grid>
            </SwiperSlide>
          );
        })}
        <SwiperSlide style={swiperStyle}>
          <Grid
            container
            direction="column"
            wrap="nowrap"
            justifyContent="center"
            alignItems="center"
            style={{
              height: "100%",
              minHeight: "50vh",
              marginBottom: "10vw",
            }}
          >
            <Grid
              item
              style={{
                width: "30vw",
                maxHeight: "50vh",
                maxWidth: "50vh",
                marginBottom: "10vw",
                border: "solid 2px blue",
                overflow: "hidden",
              }}
            >
              <Image
                className={styles.slide_image}
                src="/home/home-men-1.jpg"
                alt="/home/home-men-1.jpg"
                layout="fill"
                width={1000}
                height={850}
                // blurDataURL={prop.md}
                // placeholder="blur"
                loading="eager"
              />
            </Grid>
          </Grid>
        </SwiperSlide>
      </Swiper>
    </Fragment>
  );
}

// NOTE //
/*
  the NextJS image property "layout="fill" will fill the largest container in the tree
  so I could NOT use a smaller container to 
*/

const swiperStyle: CSSProperties = {
  maxHeight: "93.5vh",
  maxWidth: "100vw",
  backgroundColor: "#008ab4",
  objectFit: "cover",
};
const slideStyle: CSSProperties = {
  maxHeight: "85vh",
  maxWidth: "100vw",
  backgroundColor: "#000000",
  objectFit: "cover",
};

const imageProps: ImagePorp_swiper[] = [
  {
    category: MainCategory.women,
    md: "/home/women-bg.jpg",
    sm: [
      "/home/women-sm-1.jpg",
      "/home/women-sm-2.jpg",
      "/home/women-sm-3.jpg",
      "/home/women-sm-4.jpg",
      "/home/women-sm-5.jpg",
    ],
    sm_blur: [
      "/home/blur/women-sm-1.jpg",
      "/home/blur/women-sm-2.jpg",
      "/home/blur/women-sm-3.jpg",
      "/home/blur/women-sm-4.jpg",
      "/home/blur/women-sm-5.jpg",
    ],
  },
  {
    category: MainCategory.men,
    md: "/home/men-bg.jpg",
    sm: [
      "/home/men-sm-1.jpg",
      "/home/men-sm-2.jpg",
      "/home/men-sm-3.jpg",
      "/home/men-sm-4.jpg",
      "/home/men-sm-5.jpg",
      "/home/men-sm-6.jpg",
    ],
    sm_blur: [
      "/home/blur/men-sm-1.jpg",
      "/home/blur/men-sm-2.jpg",
      "/home/blur/men-sm-3.jpg",
      "/home/blur/men-sm-4.jpg",
      "/home/blur/men-sm-5.jpg",
      "/home/blur/men-sm-6.jpg",
    ],
  },
  {
    category: MainCategory.kids,
    md: "/home/kids.jpg",
    sm: [
      "/home/kids-sm-1.jpg",
      "/home/kids-sm-2.jpg",
      "/home/kids-sm-3.jpg",
      "/home/kids-sm-4.jpg",
    ],
    sm_blur: [
      "/home/blur/kids-sm-1.jpg",
      "/home/blur/kids-sm-2.jpg",
      "/home/blur/kids-sm-3.jpg",
      "/home/blur/kids-sm-4.jpg",
    ],
  },
];
