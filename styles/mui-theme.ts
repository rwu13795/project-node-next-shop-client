import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import darkScrollbar from "@mui/material/darkScrollbar";

let theme = createTheme({
  palette: {
    // type: 'light',
    primary: { main: "#008ab4" },
    secondary: { main: "#75dfff" },
    warning: { main: "#fc9403" },
    error: { main: "#f44336" },
    info: { main: "#00789e", contrastText: "#ffffff" },
  },
  typography: {
    // body1 controls all default MUI component's text font-size
    body1: {
      // fontSize: "min(5.5vw, 1.8rem)",
      fontSize: "20px",
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
      sm: 560,
      md: 765,
      lg: 1080,
      xl: 1250,
    },
  },
});

export { theme };
