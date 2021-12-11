import { useState, MouseEvent, Fragment, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import {
  clearAuthErrors,
  getUserStatus,
  selectIsLoggedIn,
  setProfileTagNum,
  signOut,
} from "../../../utils/redux-store/userSlice";
import UserGuestIcon from "./user-guest-icon";

// UI //
import {
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  Box,
} from "@mui/material";
import { Logout, Settings } from "@mui/icons-material";
import styles from "./__user-icon.module.css";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

interface Props {
  closeCartDropDown: () => void;
  page?: string;
}

function UserIcon({ closeCartDropDown, page }: Props): JSX.Element {
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

  const optionsClickHandler = (tagNum: string) => {
    if (page === "auth") {
      dispatch(setProfileTagNum(tagNum));
    } else {
      dispatch(setPageLoading(true));
      dispatch(setProfileTagNum(tagNum));
      router.push("/auth/profile");
    }
  };

  return !isLoggedIn ? (
    <Fragment>
      <UserGuestIcon page={page} closeCartDropDown={closeCartDropDown} />
    </Fragment>
  ) : (
    <Fragment>
      <Box onClick={userIconHandler} onMouseEnter={closeCartDropDown}>
        <Tooltip title="Account settings">
          <Avatar className={styles.user_icon}>R</Avatar>
        </Tooltip>
      </Box>

      <Menu
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
          className: `${styles.user_menu_card}`,
          elevation: 10,
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => optionsClickHandler("1")}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon className={styles.user_icon_sub} />
          </ListItemIcon>
          <Box className={styles.user_icon_sub_text}>User Profile</Box>
        </MenuItem>

        <MenuItem onClick={() => optionsClickHandler("2")}>
          <ListItemIcon>
            <ListAltOutlinedIcon className={styles.user_icon_sub} />
          </ListItemIcon>
          <Box className={styles.user_icon_sub_text}>Order History</Box>
        </MenuItem>

        <MenuItem onClick={() => optionsClickHandler("3")}>
          <ListItemIcon>
            <Settings className={styles.user_icon_sub} />
          </ListItemIcon>
          <Box className={styles.user_icon_sub_text}>Reset Password</Box>
        </MenuItem>

        <Divider sx={{ color: "blue" }} />

        <MenuItem onClick={signOutHandler}>
          <ListItemIcon>
            <Logout className={styles.user_icon_sub} />
          </ListItemIcon>
          <Box className={styles.user_icon_sub_text}>Logout</Box>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}

export default memo(UserIcon);
