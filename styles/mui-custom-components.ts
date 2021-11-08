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
      backgroundColor: "#008ab4",
      color: "#ffffff",
      "&:hover": { backgroundColor: "#008ab4" },
      "&:active": { backgroundColor: "#00789e" },
    },
    // "&:hover": {
    //   backgroundColor: "#00789e",
    //   color: "#ffffff",
    // },
    "&:active": {
      backgroundColor: "#00789e",
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
