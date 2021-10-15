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
} from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import {
  clearAuthErrors,
  getUserStatus,
  selectIsLoggedIn,
  signOut,
} from "../../../utils/redux-store/userSlice";
import SignInModal from "./sign-in-modal";

import styles from "./__.module.css";

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
        <IconButton onClick={userIconHandler} size="medium">
          <Avatar
            className={styles.user_icon_text}
            sx={{
              width: "7vw",
              height: "7vw",
              bgcolor: "black",
              maxWidth: "70px",
              maxHeight: "70px",
            }}
          >
            R
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={open}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
          elevation: 10,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            // these 2 lines above are for the litte triangle pointer
            borderRadius: 0,
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: 0,
              mr: 0,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 22,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => router.push("/auth/profile?tab=1")}>
          <ListItemIcon>
            <PersonOutlineOutlinedIcon sx={{ color: "black" }} />
          </ListItemIcon>
          User Profile
        </MenuItem>

        <MenuItem onClick={() => router.push("/auth/profile?tab=2")}>
          <ListItemIcon>
            <ListAltOutlinedIcon sx={{ color: "black" }} />
          </ListItemIcon>
          Order History
        </MenuItem>

        <MenuItem onClick={() => router.push("/auth/profile?tab=3")}>
          <ListItemIcon>
            <Settings sx={{ color: "black" }} />
          </ListItemIcon>
          Reset Password
        </MenuItem>

        <Divider sx={{ color: "blue" }} />

        <MenuItem onClick={signOutHandler}>
          <ListItemIcon>
            <Logout sx={{ color: "black" }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
