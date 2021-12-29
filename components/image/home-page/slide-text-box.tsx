import React, { memo } from "react";
import Link from "next/link";

// UI //
import SwiperCore, { Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from "./__swiper.module.css";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

SwiperCore.use([Pagination, Navigation]);

interface Props {
  main_cat: string;
  slide_index: number;
}

function Slide_text_box({ main_cat, slide_index }: Props): JSX.Element {
  const dispatch = useDispatch();

  const main = main_cat.toLowerCase();
  let text: string;
  let link: string;
  if (slide_index === 0) {
    text = `All ${main}${main === "kids" ? "'" : "'s"} Collections`;
    link = `/shop/${main}`;
  } else {
    if (main === "men") {
      text = `Men's ${sub_cat_men[slide_index - 1]} Collections`;
      link = `/shop/${main}/${sub_cat_men[slide_index - 1]}`;
    } else if (main === "women") {
      text = `Women's ${sub_cat_women[slide_index - 1]} Collections`;
      link = `/shop/${main}/${sub_cat_women[slide_index - 1]}`;
    } else if (main === "kids") {
      text = `Kids' ${sub_cat_kids[slide_index - 1]} Collections`;
      link = `/shop/${main}/${sub_cat_kids[slide_index - 1]}`;
    } else {
      text = `Kids' ${sub_cat_kids[slide_index - 1]} Collections`;
      link = `/shop/${main}/${sub_cat_kids[slide_index - 1]}`;
    }
  }

  if (main === "accessories") {
    if (cats[slide_index] === "") {
      text = "View All Accessories";
      link = `/shop/${main}`;
    } else {
      text = `All ${cats[slide_index]}${
        cats[slide_index] === "kids" ? "'" : "'s"
      } Accessories`;
      link = `/shop/${main}?main_cat=${cats[slide_index]}`;
    }
  }

  const onClickHandler = () => {
    dispatch(setPageLoading(true));
  };

  return (
    <Link href={link}>
      <a style={{ textDecoration: "none", color: "inherit" }}>
        <div className={styles.slide_text_box} onClick={onClickHandler}>
          <div className={styles.slide_text}>{text.toUpperCase()}</div>
          <div className={styles.text_button}>SHOP NOW</div>
        </div>
      </a>
    </Link>
  );
}

export default memo(Slide_text_box);

const sub_cat_men = ["t-shirts", "hoodies", "jeans"];
const sub_cat_women = ["dresses", "t-shirts", "jeans"];
const sub_cat_kids = ["t-shirts", "jackets", "jeans"];
const cats = ["women", "men", "kids", ""];
