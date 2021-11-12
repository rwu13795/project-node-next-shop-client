import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { mainCatArray } from "../../../utils/enums-types/product-category";
import MeunListDrawer from "./menu-list-drawer";

// UI //
import { Drawer, Box, Grid, Divider, Tooltip } from "@mui/material";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
import styles from "./__menu-list.module.css";

export default function MenuIcon(): JSX.Element {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const openMenu = () => {
    setIsDrawerOpen(true);
  };
  const closeMenu = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Fragment>
      <Box onClick={openMenu}>
        <Tooltip title="Menu">
          <MenuSharpIcon className={styles.menu_icon} />
        </Tooltip>
      </Box>

      <Drawer
        open={isDrawerOpen}
        onClose={closeMenu}
        anchor="left"
        // set the background color in the main drawer "& .MuiDrawer-paper"
        sx={{
          width: "100vw",
          "& .MuiDrawer-paper": {
            backgroundImage:
              "linear-gradient(to right, rgba(34, 185, 255, 0.5) 0%, rgb(255, 255, 255) 15%)",
            boxSizing: "border-box",
          },
        }}
      >
        <Box className={styles.menu_drawer_box}>
          <Grid container>
            <Grid item xs={6}>
              <div style={{ paddingLeft: "1.5vw" }}>
                <Link href="/">
                  <a>
                    <Image
                      src="/Nextjs-logo-1.svg"
                      alt="NextJS Logo"
                      width={165}
                      height={75}
                    />
                  </a>
                </Link>
              </div>
            </Grid>
            <Grid item xs={6}>
              <CancelPresentationSharpIcon
                className={styles.close_icon}
                onClick={closeMenu}
              />
            </Grid>
          </Grid>
          <Divider />

          {mainCatArray.map((cat, index) => {
            return (
              <MeunListDrawer
                key={index}
                cat={cat}
                setIsDrawerOpen={setIsDrawerOpen}
              />
            );
          })}
        </Box>
      </Drawer>
    </Fragment>
  );
}
