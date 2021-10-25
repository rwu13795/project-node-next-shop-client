import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { Drawer, Box, Grid, Divider } from "@mui/material";
import MenuSharpIcon from "@mui/icons-material/MenuSharp";

import { mainCatArray } from "../../../utils/enums-types/product-category";
import MeunListDrawer from "./menu-list-drawer";

export default function MenuIcon(): JSX.Element {
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const openMenu = () => {
    setOpenDrawer(true);
  };
  const closeMenu = () => {
    setOpenDrawer(false);
  };

  return (
    <Fragment>
      <Box onClick={openMenu}>
        <MenuSharpIcon />
      </Box>

      <Drawer open={openDrawer} onClose={closeMenu}>
        <div style={{ minWidth: "100vw" }}>
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
              <div onClick={closeMenu}>X</div>
            </Grid>
          </Grid>
          <Divider />
          {mainCatArray.map((cat, index) => {
            return (
              <MeunListDrawer
                key={index}
                cat={cat}
                setOpenDrawer={setOpenDrawer}
              />
            );
          })}
        </div>
      </Drawer>
    </Fragment>
  );
}
