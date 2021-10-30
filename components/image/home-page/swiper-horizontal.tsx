import {
  Dispatch,
  Fragment,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";

import { Grid } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { MainCategory } from "../../../utils/enums-types/product-category";

import styles from "./__swiper-home.module.css";
import Swiper_home from "../home-page-1/swiper";

SwiperCore.use([Pagination, Navigation, Mousewheel]);

interface Props {}

export default function Swiper_homePage_horizontal({}: Props): JSX.Element {
  return (
    <Fragment>
      <Swiper
        slidesPerView={1}
        spaceBetween={50}
        loop={true}
        style={{
          height: "95vh",
          maxWidth: "100vw",
        }}
        pagination={{
          clickable: true,
        }}
        className="mySwiper"
      >
        <SwiperSlide
          style={{
            maxHeight: "95vh",
            maxWidth: "100vw",
            backgroundColor: "#ccc",
          }}
        >
          slide-1
        </SwiperSlide>
        <SwiperSlide
          style={{
            maxHeight: "95vh",
            maxWidth: "100vw",
            backgroundColor: "#ccc",
          }}
        >
          Slide 2
        </SwiperSlide>
        <SwiperSlide
          style={{
            maxHeight: "95vh",
            maxWidth: "100vw",
            backgroundColor: "#ccc",
          }}
        >
          slide 3
        </SwiperSlide>
      </Swiper>
    </Fragment>
  );
}
