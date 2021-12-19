import { SxProps, Theme } from "@mui/system";

export interface Props {
  input_error: SxProps<Theme>;
  input_box: SxProps<Theme>;
  input_box_small: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
}

export const sxMUI: Props = {
  input_error: {
    color: "red",
    fontSize: "min(4.5vw, 13px)",
    ml: "10px",
  },

  input_box: {
    height: "60px",
    fontSize: "20px",
  },

  input_box_small: {
    height: "50px",
    fontSize: "15px",
  },
};
