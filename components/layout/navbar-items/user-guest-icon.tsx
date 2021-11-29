import { useState, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import AuthForm from "../../forms/auth-form";
import { inputFieldsArray } from "../../../pages/auth/sign-in";
import { inputTypes } from "../../../utils/enums-types/input-types";

// UI //
import { Modal, Box, Backdrop, Fade, Tooltip } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import styles from "./__user-icon.module.css";

interface Props {
  closeCartDropDown: () => void;
  page?: string;
}

export default function UserGuestIcon({
  closeCartDropDown,
  page,
}: Props): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const UserButton = (): JSX.Element => {
    return (
      <Fragment>
        <Tooltip title="Log In">
          <Box
            onMouseEnter={closeCartDropDown}
            onClick={
              page === "auth" ? () => router.push("/auth/sign-in") : handleOpen
            }
            sx={{ display: { xs: "none", md: "block" } }}
          >
            <AccountCircleIcon className={styles.user_icon_guest} />
          </Box>
        </Tooltip>

        <Tooltip title="Log In">
          <Box
            onClick={() => router.push("/auth/sign-in")}
            sx={{ display: { xs: "block", md: "none" } }}
          >
            <AccountCircleIcon className={styles.user_icon_guest} />
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
          <Box className={styles.sign_in_modal}>
            <AuthForm
              inputType={inputTypes.signIn}
              inputFieldsArray={inputFieldsArray}
              signInModal={true}
              modalHandleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}
