import { useState, Fragment, SetStateAction, Dispatch, memo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "next/image";

import {
  adminSignOut,
  deleteProduct,
} from "../../utils/redux-store/adminSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { Menu, Modal, Box, Backdrop, Fade } from "@mui/material";
import { DeleteProduct } from "../../pages/admin/products-list";

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
  openDeleteModal: boolean;
  delete_product: DeleteProduct;
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  deleteProductHandler: () => void;
}

function DeleteProdcutModal({
  openDeleteModal,
  delete_product,
  setOpenDeleteModal,
  deleteProductHandler,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const closeModal = () => setOpenDeleteModal(false);

  return (
    <Fragment>
      <Modal
        disableScrollLock={true}
        open={openDeleteModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openDeleteModal}>
          <Box sx={style}>
            <div>
              <div>{delete_product.title}</div>
              <div>
                <Image
                  src={delete_product.image}
                  alt="delete"
                  width={100}
                  height={130}
                />
              </div>
            </div>
            <div>
              This product and its related images will be deleted permanently.
            </div>
            <button onClick={deleteProductHandler}>Delete</button>
            <button onClick={closeModal}>Cancel</button>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}

export default memo(DeleteProdcutModal);
