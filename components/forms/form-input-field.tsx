import { ChangeEvent, FocusEvent, memo } from "react";
import { inputNames } from "../../utils/enums-types/input-names";

// UI //
import {
  TextField,
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  InputLabel,
  GridSize,
} from "@mui/material";
import styles from "./__form-input-field.module.css";

interface Props {
  inputName: string;
  inputValue: string;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputError: string;
  authError?: string;
  isDisabled?: boolean;
  page?: string;
}

function FormInputField(props: Props): JSX.Element {
  const {
    inputName,
    inputValue,
    onFocus,
    onBlur,
    onChange,
    authError,
    inputError,
    isDisabled,
    page,
  } = props;

  let type: string;
  switch (inputName) {
    case inputNames.password:
    case inputNames.confirm_password:
    case inputNames.old_password:
    case inputNames.new_password:
    case inputNames.confirm_new_password: {
      type = "password";
      break;
    }
    case inputNames.zip_code: {
      type = "number";
      break;
    }
    default: {
      type = inputName;
      break;
    }
  }

  console.log("page", page);

  const regex = /[_]/g;
  const inputLabel = inputName.replace(regex, " ").toUpperCase();
  const showError =
    !(authError === "" || authError === undefined) ||
    !(inputError === "" || inputError === undefined);

  let form_control = styles.form_control;
  let xs: GridSize = 12;
  let sm: GridSize = 12;
  let md: GridSize = 6;
  switch (inputName) {
    case inputNames.email: {
      md = 12;
      break;
    }

    case inputNames.zip_code: {
      form_control = styles.form_control_half;
      xs = 12;
      sm = 6;
      md = 3;
      break;
    }

    default:
      break;
  }

  if (
    page === "user-sign-in" ||
    page === "update-info" ||
    page === "checkout" ||
    page === "checkout-sign-in" ||
    page === "admin-auth"
  ) {
    md = 12;
  }

  return (
    <Grid
      item
      container
      xs={xs}
      sm={sm}
      md={md}
      className={styles.form_container}
      id={inputName}
    >
      <FormControl error={showError} className={form_control}>
        <InputLabel htmlFor={inputLabel} className={styles.form_label}>
          {inputLabel}
        </InputLabel>
        <OutlinedInput
          type={type}
          required
          name={inputName}
          value={inputValue}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          disabled={isDisabled}
          label={inputLabel}
          error={showError}
          className={styles.input_box}
        />
        <FormHelperText className={styles.input_error}>
          {authError}
          {inputError}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
}

export default memo(FormInputField);

/*
    <div>
      <label>{inputName.replace(regex, " ").toUpperCase()}</label>
      <input
        type={type}
        required
        name={inputName}
        value={inputValue}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
        disabled={isDisabled}
      ></input>
      <span>
        {authError}
        {inputError}
      </span>
    </div>
*/
