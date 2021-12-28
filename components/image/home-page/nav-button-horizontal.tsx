import { Fragment, memo, CSSProperties } from "react";

// UI //
import { Grid } from "@mui/material";
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
        <Grid container alignItems="center" className={styles.arrorw_left}>
          <div>&lt;</div>
        </Grid>
      </div>

      <div className={styles.horizontal_nav_slide_num}>
        {slideNum} / {total}
      </div>
      <div className="swiper-horizontal-next-botton" style={nav_botton}>
        <Grid container alignItems="center" className={styles.arrorw_right}>
          <div>&gt;</div>
        </Grid>
      </div>
    </Fragment>
  );
}

export default memo(Swiper_horizontal_NavButton_homePage);

const nav_botton = {
  display: "flex",
  cursor: "pointer",
} as CSSProperties;
