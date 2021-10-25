import { Fragment, useState, FormEvent } from "react";

import { Divider, Grid, TextField, Box, Drawer } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";

import SearchInputBar from "./search-input-bar";
import classes from "./_search-bar.module.css";

export default function SearchIcon(): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const openMenu = () => {
    setIsDrawerOpen(true);
  };
  const closeMenu = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Fragment>
      <SearchInputBar size="medium" />

      <Box sx={{ display: { xs: "block", md: "none" } }} onClick={openMenu}>
        <SearchSharpIcon className={classes.search_icon} />
      </Box>

      <Drawer open={isDrawerOpen} onClose={closeMenu} anchor="top">
        <Box className={classes.search_drawer}>
          <CancelPresentationSharpIcon
            className={classes.close_icon}
            onClick={closeMenu}
          />
          <SearchInputBar size="small" />
        </Box>
      </Drawer>
    </Fragment>
  );
}
