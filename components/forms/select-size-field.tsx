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
} from "@mui/material";
import styles from "./__form-input-field.module.css";

const sizeArray = ["Small", "Medium", "Large"];

interface Props {
  value: string;
  inputName: string;
  inputError: string;
  onFocusHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void;
}

function SelectSize_2({
  value,
  inputName,
  inputError,
  onFocusHandler,
  onBlurHandler,
  onChangeHandler,
}: Props): JSX.Element {
  const showError = !(inputError === undefined || inputError === "");

  return (
    <Grid item container xs={12} sm={6} md={6}>
      <FormControl error={showError} className={styles.form_control_half}>
        <InputLabel className={styles.form_label}>PURCHASED SIZE</InputLabel>
        <Select
          value={value}
          name={inputName}
          label="PURCHASED SIZE"
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          error={showError}
          MenuProps={MenuProps}
          className={styles.input_box}
        >
          {sizeArray.map((size) => {
            return (
              <MenuItem key={size} value={size}>
                {size}
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

export default memo(SelectSize_2);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "40vh",
    },
  },
};
