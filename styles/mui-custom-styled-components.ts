import {
  OutlinedTextFieldProps,
  styled,
  TextField,
  ToggleButton,
  ToggleButtonProps,
} from "@mui/material";

// MUI 5.0 new method "styled" to customize the MUI component
// DO not use the "makeStyles" method, warning will keep popping up while using this
// method in NextJS page

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
