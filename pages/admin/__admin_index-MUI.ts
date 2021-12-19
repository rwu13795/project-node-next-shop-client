import { SxProps, Theme } from "@mui/system";

interface Props {
  button: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
}

export const sxMUI: Props = {
  button: {
    width: "80%",
    maxWidth: "400px",
    fontSize: "min(16px, 4vw)",
    mt: "10px",
  },
};
