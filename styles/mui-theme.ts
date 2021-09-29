import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    // type: 'light',
    primary: {
      main: "#1212b3",
    },
    secondary: {
      main: "#bd0817",
    },
    error: {
      main: "#f44336",
    },
    info: {
      main: "#1f8ce2",
      contrastText: "#ffffff",
    },
  },
});
