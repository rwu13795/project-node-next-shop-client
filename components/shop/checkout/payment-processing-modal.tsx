import { Backdrop, Modal, Fade, CircularProgress, Box } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outerHeight: 800,
  width: "30vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

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
          <Box sx={style}>
            <div
              style={{
                fontSize: "4vw",
                textAlign: "center",
                position: "relative",
              }}
            >
              Processing Your Payment
            </div>
            <CircularProgress
              size={45}
              sx={{
                position: "fixed",
                top: "50%",
                left: "43%",
                margin: 0,
              }}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
