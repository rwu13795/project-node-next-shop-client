import { useState, Fragment, SetStateAction, Dispatch } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { adminSignOut } from "../../utils/redux-store/adminSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { Menu, Modal, Box, Backdrop, Fade } from "@mui/material";

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
  deleteModal: boolean;
  setDeleteModal: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteProdcutModal({
  deleteModal,
  setDeleteModal,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const closeModal = () => setDeleteModal(false);
  const deleteHandler = () => {
    dispatch(setPageLoading(true));
    closeModal();
    dispatch(adminSignOut());
    router.push("/");
  };

  return (
    <Fragment>
      <Modal
        disableScrollLock={true}
        open={deleteModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={deleteModal}>
          <Box sx={style}>
            <div>
              This product and its related images will be deleted permanently.
            </div>
            <button onClick={deleteHandler}>Delete</button>
            <button onClick={closeModal}>Cancel</button>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}
