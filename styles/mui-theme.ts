import { createTheme, responsiveFontSizes } from "@mui/material/styles";

let theme = createTheme({
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
  typography: {
    body1: {
      fontSize: "1.8vw",
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
      md: 770,
      lg: 1100,
      xl: 1536,
    },
  },
});

export { theme };
