import { SxProps, Theme } from "@mui/system";

export interface Props {
  input_error: SxProps<Theme>;
  //////////////////////////
  form_control: SxProps<Theme>;
  form_control_small: SxProps<Theme>;
  form_control_color: SxProps<Theme>;
  form_control_color_small: SxProps<Theme>;
  form_control_size: SxProps<Theme>;
  //////////////////////////
  form_button: SxProps<Theme>;
  form_button_icon: SxProps<Theme>;
  form_button_small: SxProps<Theme>;
  form_button_icon_small: SxProps<Theme>;
  [name: string]: SxProps<Theme>;
  /////////////////////////
  image_button: SxProps<Theme>;
  image_button_large: SxProps<Theme>;
}

export const sxMUI: Props = {
  input_error: {
    color: "red",
    fontSize: "min(4.5vw, 13px)",
    ml: "10px",
  },

  form_control: {
    width: "40vw",
    minWidth: "15rem",
    maxWidth: "35rem",
    mb: "10px",
  },
  form_control_small: {
    width: "90vw",
    minWidth: "15rem",
    maxWidth: "35rem",
    mb: "10px",
  },

  form_control_color: {
    width: "max(min(40vw, 19rem), 8rem)",
    m: "5px 5px",
  },
  form_control_color_small: {
    width: "max(min(90vw, 19rem), 8rem)",
    m: "5px 5px",
  },
  form_control_size: {
    width: "max(min(19vw, 8rem), 5rem)",
    m: "5px 5px",
  },

  form_button: {
    fontSize: "min(4vw, 1.2rem)",
    m: "5px 5px",
  },
  form_button_icon: {
    width: "max(min(2.5vw, 1.5rem), 1.2rem)",
    height: "max(min(2.5vw, 1.5rem), 1.2rem)",
  },
  form_button_small: {
    fontSize: "min(2.5vw, 0.8rem)",
    m: "0 5px",
  },
  form_button_icon_small: {
    width: "max(min(1.8vw, 1.1rem), 0.8rem)",
    height: "max(min(1.8vw, 1.1rem), 0.8rem)",
  },

  image_button: {
    width: "max(min(3.8vw, 2.4rem), 2rem)",
    height: "max(min(3.8vw, 2.4rem), 2rem)",
  },
  image_button_large: {
    width: "max(min(9vw, 6rem), 5rem)",
    height: "max(min(9vw, 6rem), 5rem)",
  },
};

// .image_button {
//   width: 3.8vw;
//   height: 3.8vw;
//   min-width: 2rem;
//   min-height: 2rem;
//   max-width: 2.4rem;
//   max-height: 2.4rem;
//   transition: ease-in 0.3s;
// }
// .image_button:hover {
//   color: rgb(0, 138, 180);
//   cursor: pointer;
//   transition: ease-in 0.3s;
// }

// .image_button_large {
//   width: 9vw;
//   height: 9vw;
//   min-width: 4.5rem;
//   min-height: 4.5rem;
//   max-width: 6rem;
//   max-height: 6rem;
//   color: black;
//   transition: ease-in 0.3s;
// }
// .image_button_large:hover {
//   color: rgb(0, 138, 180);
//   cursor: pointer;
//   transition: ease-in 0.3s;
// }
