import { ChangeEvent, FocusEvent, memo } from "react";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  GridSize,
  useMediaQuery,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import styles from "./__form-input-field.module.css";
import { sxMUI } from "./__form-input-MUI";

interface Props {
  value: string;
  inputName: string;
  inputError: string;
  onFocusHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void;
  page?: string;
}

function SelectState({
  value,
  inputName,
  inputError,
  onFocusHandler,
  onBlurHandler,
  onChangeHandler,
  page,
}: Props): JSX.Element {
  const showError = !(inputError === undefined || inputError === "");

  let md: GridSize = 3;
  if (
    page === "user-sign-in" ||
    page === "update-info" ||
    page === "checkout"
  ) {
    md = 12;
  }

  const isSmall = useMediaQuery("(max-width: 765px)");

  return (
    <Grid item container xs={12} sm={6} md={md}>
      <div
        className={styles.form_control_half}
        style={{
          marginRight: page === "user-sign-up" && !isSmall ? "10px" : "0px",
        }}
      >
        <FormControl error={showError} sx={{ width: "100%" }}>
          <InputLabel sx={{ fontSize: isSmall ? "14px" : "20px" }}>
            STATE
          </InputLabel>
          <Select
            value={value}
            name={inputName}
            label="STATE"
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={showError}
            className={styles.input_box_shadow}
            sx={isSmall ? sxMUI.input_box_small : sxMUI.input_box}
            MenuProps={MenuProps}
          >
            {stateArray.map((state) => {
              return (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText sx={sxMUI.input_error}>{inputError}</FormHelperText>
        </FormControl>
      </div>
    </Grid>
  );
}

export default memo(SelectState);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "45vh",
    },
  },
};

const stateArray = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "MontanaNebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  " West Virginia",
  "Wisconsin",
  "Wyoming",
];
