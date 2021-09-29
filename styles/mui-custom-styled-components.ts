import {
  OutlinedTextFieldProps,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonProps,
} from "@mui/material";

export const ToggleButtonStyled = styled(ToggleButton)<ToggleButtonProps>(
  ({}) => ({
    "&.Mui-selected": {
      backgroundColor: "black",
      color: "#ffffff",
      "&:hover": { backgroundColor: "black" },
      "&:active": { backgroundColor: "grey" },
    },
    // "&:hover": {
    //   backgroundColor: "grey",
    //   color: "white",
    // },
    "&:active": {
      backgroundColor: "grey",
    },
  })
);

export const TextFieldStyled = styled(TextField)<OutlinedTextFieldProps>(
  ({}) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: 0,
      },
    },
  })
);
