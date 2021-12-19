import { Fragment, Dispatch, SetStateAction, memo } from "react";
import Image from "next/image";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import { SxProps, Theme } from "@mui/system";
import { CSSProperties } from "react";

import { MainCategory } from "../../../utils/enums-types/product-category";

import styles from "./__swiper.module.css";

interface Props {
  slideNum: number;
  total: number;
}

function Swiper_horizontal_NavButton_homePage({
  slideNum,
  total,
}: Props): JSX.Element {
  return (
    <Fragment>
      <div className="swiper-horizontal-prev-botton" style={nav_botton}>
        <Grid container alignItems="center">
          <Image src="/angel-left-thin.svg" alt="left" width={30} height={30} />
        </Grid>
      </div>

      <div className={styles.horizontal_nav_slide_num}>
        {slideNum} / {total}
      </div>
      <div className="swiper-horizontal-next-botton" style={nav_botton}>
        <Grid container alignItems="center">
          <Image
            src="/angel-right-thin.svg"
            alt="right"
            width={30}
            height={30}
          />
        </Grid>
      </div>
    </Fragment>
  );
}

export default memo(Swiper_horizontal_NavButton_homePage);

const nav_botton = {
  display: "flex",
  cursor: "pointer",
  color: "red",
  border: "red solid 2px",
} as CSSProperties;

const sx_botton = {
  large: { display: { xs: "none", md: "block" } } as SxProps<Theme>,
  small: { display: { xs: "block", md: "none" } } as SxProps<Theme>,
};
