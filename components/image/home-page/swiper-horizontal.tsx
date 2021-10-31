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
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import styles from "./__swiper-homePage.module.css";
import { MainCategory } from "../../../utils/enums-types/product-category";
import Swiper_horizontal_NavButton from "./nav-button";
import zIndex from "@mui/material/styles/zIndex";

SwiperCore.use([Pagination, Navigation]);

interface Props {
  srcProp: { md: string[] };
}

export default function Swiper_homePage_horizontal({
  srcProp,
}: Props): JSX.Element {
  const [slideNum, setSlideNum] = useState<number>(1);

  const onSlideChangeHandler = (e: SwiperCore) => {
    setSlideNum(e.realIndex + 1);
  };

  return (
    <Fragment>
      <Swiper
        onSlideChange={onSlideChangeHandler}
        slidesPerView={1}
        spaceBetween={50}
        loop={true}
        navigation={{
          nextEl: ".swiper-horizontal-next-botton",
          prevEl: ".swiper-horizontal-prev-botton",
        }}
        style={{
          height: "95vh",
          maxWidth: "100vw",
          objectFit: "cover",
        }}
        className="mySwiper"
      >
        {srcProp.md.map((src, index) => {
          return (
            <SwiperSlide
              key={src + index}
              style={{
                maxHeight: "95vh",
                maxWidth: "100vw",
                backgroundColor: "#ccc",
              }}
            >
              <Image
                className={styles.slide_image}
                src={src}
                alt={src}
                layout="fill"
                // width={1000}
                // height={850}
                // blurDataURL={prop.md}
                // placeholder="blur"
                // loading="eager"
              />
            </SwiperSlide>
          );
        })}
        <div className={styles.horizontal_navbar}>
          <Swiper_horizontal_NavButton
            slideNum={slideNum}
            total={srcProp.md.length}
          />
        </div>
      </Swiper>
    </Fragment>
  );
}
