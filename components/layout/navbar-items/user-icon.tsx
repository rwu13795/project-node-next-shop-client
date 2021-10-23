import { useState, MouseEvent, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  IconButton,
  Grid,
  Box,
} from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  clearAuthErrors,
  getUserStatus,
  selectIsLoggedIn,
  signOut,
} from "../../../utils/redux-store/userSlice";
import SignInModal from "./sign-in-modal";

import classes from "./_user-icon.module.css";

export default function UserIcon({ page }: { page?: string }): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const userIconHandler = (event: MouseEvent<HTMLElement>) => {
    dispatch(clearAuthErrors("all"));
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const signOutHandler = async () => {
    dispatch(signOut());
    // re-acquire a "guest" session after signing out
    // have to wait a few seconds for the mongoDB destoying the old session
    console.log("signing out");
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/");
  };

  return !isLoggedIn ? (
    <Fragment>
      <SignInModal page={page} />
    </Fragment>
  ) : (
    <Fragment>
      <Tooltip title="Account settings">
        <IconButton onClick={userIconHandler} size="small">
          <Avatar className={classes.user_icon}>R</Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
          className: `${classes.user_menu_card}`,
          elevation: 10,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            // these 2 lines above are for the litte triangle pointer
            borderRadius: 0,
            borderColor: "black",
            border: 2,
            zIndex: 1,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => router.push("/auth/profile?tab=1")}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon className={classes.user_icon_sub} />
          </ListItemIcon>
          <Box className={classes.user_icon_sub_text}>User Profile</Box>
        </MenuItem>

        <MenuItem onClick={() => router.push("/auth/profile?tab=2")}>
          <ListItemIcon>
            <ListAltOutlinedIcon className={classes.user_icon_sub} />
          </ListItemIcon>
          <Box className={classes.user_icon_sub_text}>Order History</Box>
        </MenuItem>

        <MenuItem onClick={() => router.push("/auth/profile?tab=3")}>
          <ListItemIcon>
            <Settings className={classes.user_icon_sub} />
          </ListItemIcon>
          <Box className={classes.user_icon_sub_text}>Reset Password</Box>
        </MenuItem>

        <Divider sx={{ color: "blue" }} />

        <MenuItem onClick={signOutHandler}>
          <ListItemIcon>
            <Logout className={classes.user_icon_sub} />
          </ListItemIcon>
          <Box className={classes.user_icon_sub_text}>Logout</Box>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
