import { Fragment, useState } from "react";

import { Grid } from "@mui/material";

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import SwiperBottons_home from "./swiper-buttons";
import LargeSlide_home from "./large-slide";
import SmallSlide_home from "./small-slide";

import { MainCategory } from "../../../utils/enums-types/product-category";

SwiperCore.use([Pagination, Navigation]);

export interface ImagePorp_swiper {
  category: string;
  md: string;
  sm: string[];
}

const imageProps: ImagePorp_swiper[] = [
  {
    category: MainCategory.women,
    md: "/home/women.jpg",
    sm: [
      "/home/women-sm-1.jpg",
      "/home/women-sm-2.jpg",
      "/home/women-sm-3.jpg",
      "/home/women-sm-4.jpg",
      "/home/women-sm-5.jpg",
    ],
  },
  {
    category: MainCategory.men,
    md: "/home/men.jpg",
    sm: [
      "/home/men-sm-1.jpg",
      "/home/men-sm-2.jpg",
      "/home/men-sm-3.jpg",
      "/home/men-sm-4.jpg",
      "/home/men-sm-5.jpg",
      "/home/men-sm-6.jpg",
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
  },
];

export default function Swiper_home({}): JSX.Element {
  const [cat, setCat] = useState<string>(MainCategory.women);

  return (
    <Fragment>
      <Swiper
        slidesPerView={1}
        spaceBetween={200}
        loop={true}
        navigation={{
          nextEl: ".swiper-home-next-botton",
          prevEl: ".swiper-home-prev-botton",
        }}
        freeMode={true}
        className="mySwiper"
      >
        <SwiperBottons_home cat={cat} setCat={setCat} />
        {imageProps.map((prop, index) => {
          let title;
          if (prop.category === MainCategory.men) {
            title = "JoJo Collections";
          } else if (prop.category === MainCategory.women) {
            title = "Moon Crystal Collections";
          } else {
            title = "Cartman's collections";
          }
          return (
            <SwiperSlide key={index + prop.category}>
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
                <LargeSlide_home title={title} prop={prop} />
                <SmallSlide_home title={title} prop={prop} />
              </Grid>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Fragment>
  );
}
