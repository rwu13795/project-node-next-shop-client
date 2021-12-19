import { SxProps, Theme } from "@mui/system";

export interface Props {
  input_error: SxProps<Theme>;
  form_control: SxProps<Theme>;
  form_control_small: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
}

export const sxMUI: Props = {
  input_error: {
    color: "red",
    fontSize: "min(4.5vw, 13px)",
    ml: "10px",
  },

  form_control: {
    width: "40vw",
    minWidth: "15rem",
    maxWidth: "35rem",
    mb: "10px",
  },

  form_control_small: {
    width: "89vw",
    minWidth: "15rem",
    maxWidth: "35rem",
    mb: "10px",
  },
};
