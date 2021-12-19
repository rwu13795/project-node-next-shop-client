import { Fragment, useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";

import SwiperCore, { Pagination, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useDispatch } from "react-redux";
import { setLockScrollBar } from "../../../utils/redux-store/layoutSlice";
import Swiper_vertical_homePage from "./swiper-vertical";

SwiperCore.use([Pagination, Navigation, Mousewheel]);

interface Props {}

function Swiper_homePage({}: Props): JSX.Element {
  const [slideEnd, setSlideEnd] = useState<boolean>(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLockScrollBar(true));
    // when this component is unmounted, set the LockScrollBar to false
    return () => {
      dispatch(setLockScrollBar(false));
    };
  }, [dispatch]);

  useEffect(() => {
    if (slideEnd) {
      console.log("slide end");
      dispatch(setLockScrollBar(false));
      // sligtly scroll down a bit, so that window can listen to the "scrollTop == 0" below
    }
  }, [slideEnd, dispatch]);

  // useEffect(() => {
  //   if (slideEnd) {

  //     // window.onscroll = () => {
  //     //   console.log("window on scroll");
  //     //   if (document.documentElement.scrollTop == 0) {
  //     //     setSlideEnd(false);
  //     //   }
  //     // };
  //   }
  //   return () => {
  //     window.onscroll = null;
  //   };
  // }, [slideEnd, dispatch]);

  return (
    // While using "%" to set height and width, all elements Node in the chain must
    // have their styles set as "height: xx%; width: xx%"
    // if one of the node misses this styles, all the children belong to this node
    // won't get the height and width from the root node

    <div style={{ height: "100%", overflow: "hidden" }}>
      <Swiper_vertical_homePage setSlideEnd={setSlideEnd} slideEnd={slideEnd} />
    </div>
  );
}

// export default memo(Swiper_homePage);

export default memo(
  dynamic(() => Promise.resolve(Swiper_homePage), {
    ssr: false,
  })
);

/*

// render an hidden box on top of the swiper, so that user won't be able to scroll
// the swiper untill the window scroll reaches 0
      {slideEnd && (
        <div
          onClick={scrollToTop}
          onDrag={scrollToTop}
          style={{
            marginTop: "6rem",
            width: "1vw",
            height: "1vh",
            position: "absolute",
            top: 0,
            zIndex: 9,
            backgroundColor: "red",
          }}
        ></div>
      )}

// If the user stay on the last slide, user can not click on the last slide, since
// it is coverd by this invisible <div>. So not a good solution

 */
