import { useState, Fragment, SetStateAction, Dispatch } from "react";

import { useRouter } from "next/router";

import { Menu, Modal, Box, Backdrop, Fade } from "@mui/material";
import { useDispatch } from "react-redux";
import { adminSignOut } from "../../utils/redux-store/adminSlice";

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

interface Props {
  adminModal: boolean;
  setAdminModal: Dispatch<SetStateAction<boolean>>;
}

export default function AdminSignOutModal({
  adminModal,
  setAdminModal,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const closeModal = () => setAdminModal(false);
  const signOut = () => {
    dispatch(adminSignOut());
    router.push("/");
  };

  return (
    <Fragment>
      <Modal
        disableScrollLock={true}
        open={adminModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={adminModal}>
          <Box sx={style}>
            <div>
              Going back to Home Page will sign you out the current
              Administration session
            </div>
            <button onClick={signOut}>Continue</button>
            <button onClick={closeModal}>Cancel</button>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}
