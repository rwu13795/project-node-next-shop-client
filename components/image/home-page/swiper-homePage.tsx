import { Fragment, useEffect, useState } from "react";

import { Grid } from "@mui/material";

import SwiperCore, { Pagination, Navigation, Mousewheel } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useDispatch } from "react-redux";
import { setLockScrollBar } from "../../../utils/redux-store/layoutSlice";
import Swiper_homePage_vertical from "./swiper-vertical";

SwiperCore.use([Pagination, Navigation, Mousewheel]);

interface Props {}

export default function Swiper_homePage({}: Props): JSX.Element {
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
      dispatch(setLockScrollBar(false));
      // sligtly scroll down a bit, so that window can listen to the "scrollTop == 0" below
      let id = setTimeout(() => (document.documentElement.scrollTop = 5), 300);
      // return () => {
      //   clearTimeout(id);
      // };
    }
  }, [slideEnd, dispatch]);

  useEffect(() => {
    if (slideEnd) {
      window.onscroll = () => {
        if (document.documentElement.scrollTop == 0) {
          setSlideEnd(false);
        }
      };
    }
  }, [slideEnd, dispatch]);

  return (
    <div>
      <Swiper_homePage_vertical setSlideEnd={setSlideEnd} />
    </div>
  );
}

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
