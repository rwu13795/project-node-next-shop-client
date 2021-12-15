import { useState, Fragment, SetStateAction, Dispatch, memo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { adminSignOut } from "../../utils/redux-store/adminSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { Menu, Modal, Box, Backdrop, Fade, Button } from "@mui/material";
import styles from "./__admin-sign-in-up.module.css";

interface Props {
  adminModal: boolean;
  setAdminModal: Dispatch<SetStateAction<boolean>>;
}

function AdminSignOutModal({ adminModal, setAdminModal }: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const closeModal = () => setAdminModal(false);
  const signOut = () => {
    dispatch(setPageLoading(true));
    closeModal();
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
          <Box className={styles.sign_out_modal}>
            <div className={styles.modal_text}>
              Going back to Home Page will sign you out from the current
              Administration session
            </div>
            <div className={styles.modal_button_box}>
              <Button
                variant="outlined"
                color="error"
                onClick={signOut}
                className={styles.modal_button}
              >
                Continue
              </Button>
              <Button
                variant="outlined"
                onClick={closeModal}
                className={styles.modal_button}
              >
                Cancel
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}

export default memo(AdminSignOutModal);
