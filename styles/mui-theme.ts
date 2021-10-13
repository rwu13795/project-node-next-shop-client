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
    fontSize: 14,
    fontFamily: ["Black Ops One", "Monofett", "sans-serif"].join(","),
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 580,
      md: 800,
      lg: 1100,
      xl: 1536,
    },
  },
});

theme.typography.h3 = {
  fontSize: "0.65rem",
  "@media (min-width:600px)": {
    fontSize: "1.2rem",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "1.9rem",
  },
};

export { theme };
