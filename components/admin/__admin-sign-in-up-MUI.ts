import { SxProps, Theme } from "@mui/system";

interface Props {
  button: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
}

export const sxMUI: Props = {
  button: {
    width: "65%",
    maxWidth: "300px",
    fontSize: "min(16px, 4vw)",
    mt: "10px",
  },
};
