import Image from "next/image";
import { useState, Fragment, CSSProperties, MouseEvent, memo } from "react";

import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// Swiper //
import { Swiper, SwiperSlide } from "swiper/react";
import { PaginationOptions } from "swiper/types/modules/pagination";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import SwiperCore, { Pagination } from "swiper";

// UI //
import { Grid, Box, Modal, Fade, Backdrop } from "@mui/material";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
import styles from "./__swiper.module.css";

interface Props {
  currentColor: PageColorProps;
  onSlideChangeHandler: (swiper: SwiperCore) => void;
  screenSize: string;
  previewImage: string;
}

SwiperCore.use([Pagination]);

function Swiper_product_detail_images({
  currentColor,
  onSlideChangeHandler,
  screenSize,
  previewImage,
}: Props): JSX.Element {
  /********************************************************************************/
  const paginationOption: PaginationOptions = {
    el: ".horizontal-pagination-product-detail",
    bulletClass: styles.main_swpier_small_pagination_bullet,
    bulletActiveClass: styles.main_swpier_small_pagination_bullet_active,
    clickable: true,
    // need to use <div> instead of the default <span> in order to make the
    // bullets vertical
    renderBullet: function (index, className) {
      return '<div class="' + className + '"></div>';
    },
  };

  const horizontal_pagination = {
    position: "absolute",
    bottom: "2vw",
    zIndex: 88,
    width: "100vw",
    height: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  } as CSSProperties;
  /********************************************************************************/

  const [open, setOpen] = useState<boolean>(false);
  const [openImg, setOpenImg] = useState<string>("");

  const zoomInHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    // use the "e.nativeEvent" to get the offsetX/Y in react-DOM
    let posX = e.nativeEvent.offsetX;
    let posY = e.nativeEvent.offsetY;
    let width = e.currentTarget.offsetWidth;

    // reposition the enlarged image opposite to the mouse x/y axis movement
    // it creates a browsing effect
    // the multiplier should be half of the width of the enlarged image
    e.currentTarget.style.backgroundSize = `${width * 2}px`;
    e.currentTarget.style.backgroundPosition =
      -posX * 1 + "px " + -posY * 1 + "px";
  };

  const zoomOutHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    e.currentTarget.style.backgroundPosition = "center";
    e.currentTarget.style.backgroundSize = "contain";
  };

  const openModalHandler = (img: string) => {
    setOpenImg(img);
    setOpen(true);
  };
  const closeModalHandler = () => {
    setOpen(false);
  };

  let content: JSX.Element;
  if (previewImage !== "") {
    content = (
      <Fragment>
        <Swiper slidesPerView={1} className={styles.main_swpier}>
          <SwiperSlide className={styles.main_swiper_slide}>
            <div
              className={styles.main_swpier_image}
              style={{
                background: `url(${previewImage})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            ></div>
          </SwiperSlide>
        </Swiper>
      </Fragment>
    );
  } else {
    content = (
      <Fragment>
        <Swiper
          id={
            screenSize === "large"
              ? "images_swiper_large_product_detail"
              : "images_swiper_medium_product_detail"
          }
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
                  // since all the images have different size and ratio, it is impossible
                  // to fit the image inside the box perfectly
                  // if the size of all images is the same, the images can be easily fit inside
                  // the box with the same size by using "contain" or "cover"
                  style={{
                    background: `url(${img})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
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

  return screenSize !== "small" ? (
    content
  ) : (
    <Fragment>
      <Swiper
        slidesPerView={1}
        spaceBetween={50}
        pagination={paginationOption}
        loop={true}
        className={styles.main_swpier_small}
      >
        {currentColor.imageFiles.map((img, index) => {
          return (
            <SwiperSlide
              key={img + index}
              className={styles.main_swiper_slide_small}
            >
              <Image
                src={img}
                alt={img}
                layout="responsive"
                width={500}
                height={550}
                blurDataURL={img}
                placeholder="blur"
                className={styles.slide_image}
                onClick={() => openModalHandler(img)}
              />
            </SwiperSlide>
          );
        })}
        <div
          className="horizontal-pagination-product-detail"
          style={horizontal_pagination}
        ></div>
      </Swiper>

      <Modal
        open={open}
        onClose={closeModalHandler}
        sx={{ overflow: "scroll" }}
      >
        <Fade in={open}>
          <div className={styles.main_swpier_small_modal}>
            <Image
              src={openImg}
              alt={openImg}
              layout="fill"
              className={styles.slide_image}
              onClick={closeModalHandler}
            />
          </div>
        </Fade>
      </Modal>
      {open && (
        <CancelPresentationSharpIcon
          className={styles.close_modal}
          onClick={closeModalHandler}
        />
      )}
    </Fragment>
  );
}

export default memo(Swiper_product_detail_images);
