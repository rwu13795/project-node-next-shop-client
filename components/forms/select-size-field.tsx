import { ChangeEvent, FocusEvent, memo } from "react";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  useMediaQuery,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import styles from "./__form-input-field.module.css";
import { sxMUI } from "./__form-input-MUI";

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

  const isSmall = useMediaQuery("(max-width: 765px)");

  return (
    <Grid item container xs={12} sm={6} md={6}>
      <div className={styles.form_control_half}>
        <FormControl error={showError} sx={{ width: "100%" }}>
          <InputLabel sx={{ fontSize: isSmall ? "14px" : "20px" }}>
            PURCHASED SIZE
          </InputLabel>
          <Select
            value={value}
            name={inputName}
            label="PURCHASED SIZE"
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            error={showError}
            MenuProps={MenuProps}
            className={styles.input_box_shadow}
            sx={isSmall ? sxMUI.input_box_small : sxMUI.input_box}
          >
            {sizeArray.map((size) => {
              return (
                <MenuItem key={size} value={size}>
                  {size}
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

export default memo(SelectSize_2);

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: "40vh",
    },
  },
};
