import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Menu,
  Modal,
  Box,
  Backdrop,
  Fade,
  MenuItem,
  Button,
  Avatar,
  Divider,
  ListItemIcon,
  Tooltip,
  Grid,
  IconButton,
} from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import AuthForm from "../../auth/forms/auth-form";
import { inputFieldsArray } from "../../../pages/auth/sign-in";
import { inputTypes } from "../../../utils/enums-types/input-types";

import classes from "./_user-icon.module.css";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outerHeight: 800,
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function UserGuestIcon({
  page,
}: {
  page?: string;
}): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const UserButton = (): JSX.Element => {
    return (
      <Fragment>
        <Tooltip title="Log In">
          <Box
            onClick={
              page === "auth" ? () => router.push("/auth/sign-in") : handleOpen
            }
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <AccountCircleIcon className={classes.user_icon_guest} />
          </Box>
        </Tooltip>

        <Tooltip title="Log In">
          <Box
            onClick={() => router.push("/auth/sign-in")}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <AccountCircleIcon className={classes.user_icon_guest} />
          </Box>
        </Tooltip>
      </Fragment>
    );
  };

  return page === "auth" ? (
    <Link href="/auth/sign-in">
      <a>
        <UserButton />
      </a>
    </Link>
  ) : (
    <Fragment>
      <UserButton />

      <Modal
        disableScrollLock={true}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <AuthForm
              inputType={inputTypes.signIn}
              inputFieldsArray={inputFieldsArray}
              modalHandleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}
