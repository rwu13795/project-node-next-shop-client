import { Fragment, useState, memo } from "react";

import SearchInputBar from "./search-input-bar";

// UI //
import { Box, Drawer, Tooltip } from "@mui/material";
import SearchSharpIcon from "@mui/icons-material/SearchSharp";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
import styles from "./__search-bar.module.css";

function SearchIcon(): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const openMenu = () => {
    setIsDrawerOpen(true);
  };
  const closeMenu = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Fragment>
      <Box>
        <SearchInputBar size="medium" />
      </Box>

      <Box sx={{ display: { xs: "block", md: "none" } }} onClick={openMenu}>
        <Tooltip title="Search">
          <SearchSharpIcon className={styles.search_icon} />
        </Tooltip>
      </Box>

      <Drawer open={isDrawerOpen} onClose={closeMenu} anchor="top">
        <Box className={styles.search_drawer}>
          <CancelPresentationSharpIcon
            className={styles.close_icon}
            onClick={closeMenu}
          />
          <SearchInputBar size="small" setIsDrawerOpen={setIsDrawerOpen} />
        </Box>
      </Drawer>
    </Fragment>
  );
}

export default memo(SearchIcon);
