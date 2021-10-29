import { Fragment, Dispatch, SetStateAction } from "react";
import Image from "next/image";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import { ImagePorp_swiper } from "./swiper";
import { slide_large, sx_slide_large } from "./__styles-slide";

interface Props {
  title: string;
  prop: ImagePorp_swiper;
}

export default function LargeSlide_home({ title, prop }: Props): JSX.Element {
  return (
    <Fragment>
      <Box style={slide_large.title} sx={sx_slide_large.title}>
        {title}
      </Box>
      <Grid item style={slide_large.slide} sx={sx_slide_large.slide}>
        <Image
          src={prop.md}
          alt={prop.md}
          width={1300}
          height={1100}
          blurDataURL={prop.md}
          placeholder="blur"
          loading="eager"
        />
      </Grid>
    </Fragment>
  );
}
