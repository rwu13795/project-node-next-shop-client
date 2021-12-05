import { ChangeEvent, FocusEvent, memo } from "react";

// UI //
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormHelperText,
  Grid,
  GridSize,
} from "@mui/material";
import styles from "./__form-input-field.module.css";

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

  return (
    <Grid item container xs={12} sm={6} md={md}>
      <FormControl error={showError} className={styles.form_control_half}>
        <InputLabel className={styles.form_label}>STATE</InputLabel>
        <Select
          value={value}
          name={inputName}
          label="STATE"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          error={showError}
          className={styles.input_box}
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
        <FormHelperText className={styles.input_error}>
          {inputError}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
}

export default memo(SelectState);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "40vh",
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

/*
    <FormControl error={error_main} className={styles.form_control}>
          <InputLabel id="main-cat-select">Main-Category</InputLabel>
          <Select
            labelId="main-cat-select"
            value={capitalize(productInfo.main_cat)}
            name={inputNames.main}
            label="Main Category" // the length oflabel string will determine the length of line break in the box
            onChange={onChangeHandler}
            error={error_main}
            className={styles.input_box_shadow}
          >
            {mainCatArray.map((cat) => {
              return (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText className={styles.input_error}>
            {propError[inputNames.main]}
          </FormHelperText>
      </FormControl>

 */
