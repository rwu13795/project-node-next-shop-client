import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Drawer,
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  List,
  Collapse,
  Grid,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import StarBorder from "@mui/icons-material/StarBorder";

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
        <ListIcon />
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
          <ItemDrawer />
        </div>
      </Drawer>
    </Fragment>
  );
}

const ItemDrawer = (): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Fragment>
      <ListItemButton onClick={toggleDrawer}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </Fragment>
  );
};
