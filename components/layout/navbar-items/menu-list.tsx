import { Fragment, useState, FormEvent } from "react";
import Link from "next/link";

import { Divider, Grid, TextField, Box } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import classes from "./_menu-list.module.css";
import { mainCatArray } from "../../../utils/enums-types/product-category";

const mui_sx = {
  paddingRight: 2,
  display: { xs: "none", md: "block" },
} as SxProps<Theme>;

export default function MenuList({}): JSX.Element {
  return (
    <Fragment>
      {mainCatArray.map((cat, index) => {
        return (
          <Grid item sx={mui_sx} key={index}>
            <Link href={`/shop/${cat.toLowerCase()}`}>
              <a className={classes.menu_list}>{cat.toUpperCase()}</a>
            </Link>
          </Grid>
        );
      })}
    </Fragment>
  );
}
