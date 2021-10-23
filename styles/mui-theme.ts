import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";

let theme = createTheme({
  palette: {
    // type: 'light',
    primary: {
      main: "#0099CC",
    },
    secondary: {
      main: "#0099CC",
    },
    error: {
      main: "#f44336",
    },
    info: {
      main: "#0099CC",
      contrastText: "#ffffff",
    },
  },
  typography: {
    body1: {
      fontSize: "4.2vw",
      fontFamily: ["Oswald", "Monofett", "sans-serif"].join(","),
    },
    h3: {
      fontSize: "3vw",
      // "@media (min-width:580px)": {
      //   fontSize: "3.5vw",
      // },
      // "@media (min-width:770px)": {
      //   fontSize: "3vw",
      // },
      fontFamily: ["Oswald", "Monofett", "sans-serif"].join(","),
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 580,
      md: 775,
      lg: 1100,
      xl: 1536,
    },
  },
});

export { theme };
