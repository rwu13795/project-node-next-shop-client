import { Fragment, Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import {
  next_botton,
  prev_botton,
  next_botton_small,
  prev_botton_small,
  sx_botton,
} from "./__styles-button";
import { MainCategory } from "../../../utils/enums-types/product-category";

interface Props {
  cat: string;
  setCat: Dispatch<SetStateAction<string>>;
}

export default function SwiperBottons_home({
  cat,
  setCat,
}: Props): JSX.Element {
  let prev: string = "";
  let next: string = "";
  switch (cat) {
    case MainCategory.men: {
      prev = MainCategory.women;
      next = MainCategory.kids;
      break;
    }
    case MainCategory.women: {
      prev = MainCategory.kids;
      next = MainCategory.men;
      break;
    }
    case MainCategory.kids: {
      prev = MainCategory.men;
      next = MainCategory.women;
      break;
    }
    default:
      break;
  }

  const prevOnClickHandler = () => {
    setCat(prev);
  };

  const nextOnClickHandler = () => {
    setCat(next);
  };

  return (
    <Fragment>
      {/* large */}

      <Box
        onClick={prevOnClickHandler}
        className="swiper-home-prev-botton"
        style={prev_botton.position}
        sx={sx_botton.large}
      >
        <Grid container alignItems="center">
          <Image src="/angel-left-thin.svg" alt="left" width={35} height={35} />
          <div style={prev_botton.text}>{prev}</div>
        </Grid>
      </Box>
      <Box
        onClick={nextOnClickHandler}
        className="swiper-home-next-botton"
        style={next_botton.position}
        sx={sx_botton.large}
      >
        <Grid container alignItems="center">
          <div style={next_botton.text}>{next}</div>
          <Image
            src="/angel-right-thin.svg"
            alt="right"
            width={35}
            height={35}
          />
        </Grid>
      </Box>

      {/* small */}
      <Box
        onClick={prevOnClickHandler}
        className="swiper-home-prev-botton"
        style={prev_botton_small.position}
        sx={sx_botton.small}
      >
        <Grid container alignItems="center">
          <Image src="/angel-left-thin.svg" alt="left" width={29} height={29} />
          <div style={prev_botton_small.text}>{prev}</div>
        </Grid>
      </Box>
      <Box
        onClick={nextOnClickHandler}
        className="swiper-home-next-botton"
        style={next_botton_small.position}
        sx={sx_botton.small}
      >
        <Grid container alignItems="center">
          <div style={next_botton_small.text}>{next}</div>
          <Image
            src="/angel-right-thin.svg"
            alt="right"
            width={29}
            height={29}
          />
        </Grid>
      </Box>
    </Fragment>
  );
}
