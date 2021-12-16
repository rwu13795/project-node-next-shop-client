import { Fragment, SetStateAction, Dispatch, memo } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Image from "next/image";

import { DeleteProduct } from "../../pages/admin/products-list";

// UI //
import { Modal, Box, Backdrop, Fade, Button } from "@mui/material";
import styles from "./__admin-sign-in-up.module.css";

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
          <Box className={styles.delete_warning_modal}>
            <div className={styles.delete_left_grid}>
              <div className={styles.modal_text}>{delete_product.title}</div>
              <div className={styles.delete_image}>
                <Image
                  src={delete_product.image}
                  alt="delete"
                  width={200}
                  height={260}
                />
              </div>
            </div>
            <div className={styles.delete_right_grid}>
              <div className={styles.modal_text}>
                This product and its related images will be deleted permanently
              </div>
              <div className={styles.modal_button_box}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={deleteProductHandler}
                  className={styles.modal_button}
                >
                  Delete
                </Button>
                <Button
                  variant="outlined"
                  onClick={closeModal}
                  className={styles.modal_button}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}

export default memo(DeleteProdcutModal);
