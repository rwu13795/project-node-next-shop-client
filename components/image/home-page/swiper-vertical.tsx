import { Dispatch, Fragment, SetStateAction, memo, CSSProperties } from "react";
import { useDispatch } from "react-redux";

import { setLockScrollBar } from "../../../utils/redux-store/layoutSlice";
import { homeImageProps } from "./image-props";
import Swiper_horizontal_homePage from "./swiper-horizontal";

// UI //
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { PaginationOptions } from "swiper/types/modules/pagination";
import styles from "./__swiper.module.css";

SwiperCore.use([Pagination, Navigation, Mousewheel]);

interface Props {
  setSlideEnd: Dispatch<SetStateAction<boolean>>;
  slideEnd: boolean;
}

const paginationOption: PaginationOptions = {
  // NOTE (2) //
  el: ".vertical-navbar",
  bulletClass: styles.swiper_pagination_bullet,
  bulletActiveClass: styles.swiper_pagination_bullet_active,
  clickable: true,
  // need to use <div> instead of the default <span> in order to make the
  // bullets vertical
  renderBullet: function (index, className) {
    return '<div class="' + className + '"></div>';
  },
};

function Swiper_vertical_homePage({
  setSlideEnd,
  slideEnd,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  // NOTE (3) //
  const reachEndHandler = () => {
    setTimeout(() => setSlideEnd(true), 300);
  };

  const slideChangeHandler = () => {
    dispatch(setLockScrollBar(true));
    setSlideEnd(false);
  };

  return (
    <Fragment>
      <Swiper
        onSlideChange={slideChangeHandler}
        onReachEnd={reachEndHandler}
        mousewheel={{
          releaseOnEdges: true,
        }}
        pagination={paginationOption}
        touchReleaseOnEdges={true}
        edgeSwipeDetection={true}
        spaceBetween={0}
        direction="vertical"
        slidesPerView={1}
        className={styles.swiper_vertical_home_page}
      >
        {homeImageProps.map((prop, index) => {
          return (
            <SwiperSlide
              key={index + prop.category}
              style={{
                position: "relative",
                height: "100%",
                width: "100vw",
              }}
            >
              <Swiper_horizontal_homePage srcProp={prop} />
            </SwiperSlide>
          );
        })}
        <div className="vertical-navbar" style={vertical_navbar}></div>
      </Swiper>
    </Fragment>
  );
}

export default memo(Swiper_vertical_homePage);

const vertical_navbar: CSSProperties = {
  position: "absolute",
  left: "min(1.5rem, 1.9vw)",
  top: "43vh",
  zIndex: 99,
  width: "25px",
  height: "300px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
};

// NOTE (1) //
/*
  the NextJS image property "layout="fill" will fill the largest container in the tree
  so I could NOT use a smaller container to contain the image (like what I did to the
    the old homePage swiper)
*/

// NOTE (2) //
/*
  CANNOT select the container element as the docus said directly using the 
  module.css className
      { el: styles.swiper_pagination }
      <div className={styles.swiper_pagination}></div>

  Workaround: 
  assign a typical className to the element, and select that className
  ,then use style={...} to customize this <div> directly
  (same as the navigation next/prev button).

        <div className="horizontal-navbar" style={...}></div>
        { el: ".horizontal-navbar" }

  But as long as the "bulletClass" and "bulletActiveClass" can be selected directly
  by using the module className, I can style the bullets without using a customized
  container, the default one is good enough

  PS: at the end, I have to use the Workaround method, I need to use the container
      to use the flex-box alignment

*/

// NOTE (3) //
/* 
  After reaching to the last slide, if the Swiper need to be unmounted, it has
  to wait for a bit, because the last slide might still be loading the CSS. and 
  unmounting it at the moment will cause error
*/
