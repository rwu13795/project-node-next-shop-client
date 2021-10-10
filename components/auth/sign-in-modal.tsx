import { useState } from "react";
import Link from "next/link";

import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

import AuthForm from "./auth-form";
import { inputFieldsArray } from "../../pages/auth/sign-in";
import { inputTypes } from "../../utils/enums-types/input-types";

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

export default function SignInModal({ page }: { page?: string }): JSX.Element {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return page === "sign-up" || page === "sign-in" ? (
    <Link href="/auth/sign-in">
      <a>
        <Button variant="contained">Sign In</Button>{" "}
      </a>
    </Link>
  ) : (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Sign In
      </Button>
      <Modal
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
    </div>
  );
}
