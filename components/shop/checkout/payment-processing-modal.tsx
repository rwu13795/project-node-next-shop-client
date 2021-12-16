import { Backdrop, Modal, Fade, CircularProgress, Box } from "@mui/material";
import styles from "./__payment-processing.module.css";

export default function PaymentProcessingModal({}): JSX.Element {
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={true}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={true}>
          <Box className={styles.processing_modal}>
            <div className={styles.modal_text}>PROCESSING YOUR PAYMENT</div>
            <div className={styles.cube_container}>
              <div className={styles.processing_cube}></div>
              <div className={styles.processing_cube}></div>
              <div className={styles.processing_cube}></div>
              <div className={styles.processing_cube}></div>
              <div className={styles.processing_cube}></div>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
