import { Fragment, useState, FormEvent } from "react";

import SearchInputBar from "./search-input-bar";

// UI //
import { Divider, Grid, TextField, Box, Drawer } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
import styles from "./__search-bar.module.css";

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
        <SearchSharpIcon className={styles.search_icon} />
      </Box>

      <Drawer open={isDrawerOpen} onClose={closeMenu} anchor="top">
        <Box className={styles.search_drawer}>
          <CancelPresentationSharpIcon
            className={styles.close_icon}
            onClick={closeMenu}
          />
          <SearchInputBar size="small" />
        </Box>
      </Drawer>
    </Fragment>
  );
}
