import { Fragment } from "react";
import Image from "next/image";

import { Box } from "@mui/system";
import { Grid } from "@mui/material";

import { ImagePorp_swiper } from "./swiper";
import { slide_small, sx_slide_small } from "./__styles-slide";
import { MainCategory } from "../../../utils/enums-types/product-category";

interface Props {
  title: string;
  prop: ImagePorp_swiper;
}

export default function SmallSlide_home({ title, prop }: Props): JSX.Element {
  return (
    <Fragment>
      <Box style={slide_small.title} sx={sx_slide_small.title}>
        {title}
      </Box>
      <Grid item container style={slide_small.slide} sx={sx_slide_small.slide}>
        {prop.sm.map((src, index) => {
          let top, left, width, height;
          if (prop.category === MainCategory.men) {
            top = 5 + index * 8;
            left = 10 + index * 13;
            width = 95;
            height = 440;
          } else if (prop.category === MainCategory.women) {
            top = 7 + index * 11;
            left = 10 + index * 16;
            width = 130;
            height = 480;
          } else {
            top = 10 + index * 11;
            left = 10 + index * 20;
            width = 250;
            height = 1100;
          }
          return (
            <Box
              key={index + src}
              style={{
                width: "20%",
                maxWidth: `${width}px`,
                position: "absolute",
                top: `${top}%`,
                left: `${left}%`,
                backgroundColor: "black",
              }}
              sx={{ boxShadow: 15 }}
            >
              <Image
                src={src}
                alt={src}
                width={width}
                height={height}
                blurDataURL={prop.sm_blur[index]}
                placeholder="blur"
                loading="eager"
              />
            </Box>
          );
        })}
      </Grid>
    </Fragment>
  );
}
