import { SxProps, Theme } from "@mui/system";

interface Props {
  to_sign_up: SxProps<Theme>;
  to_sign_up_small: SxProps<Theme>;
  sign_in_button: SxProps<Theme>;
  sign_in_button_small: SxProps<Theme>;
  reset_button: SxProps<Theme>;
  reset_button_small: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
}

export const sxMUI: Props = {
  to_sign_up: {
    width: "26vw",
    minWidth: "300px",
    fontSize: "16px",
    mt: "10px",
  },
  to_sign_up_small: {
    width: "70vw",
    minWidth: "200px",
    fontSize: "min(16px, 4vw)",
    mt: "10px",
  },

  sign_in_button: {
    width: "180px",
    fontSize: "16px",
  },
  sign_in_button_small: {
    width: "min(180px, 40vw)",
    fontSize: "min(16px, 4vw)",
  },

  reset_button: { mb: "10px", mt: "10px", fontSize: "16px", width: "200px" },
  reset_button_small: {
    mb: "10px",
    mt: "10px",
    fontSize: "min(16px, 4vw)",
    width: "min(200px, 50vw)",
  },
};
