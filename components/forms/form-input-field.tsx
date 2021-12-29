import { ChangeEvent, FocusEvent, memo } from "react";
import { inputNames } from "../../utils/enums-types/input-names";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  InputLabel,
  GridSize,
  useMediaQuery,
} from "@mui/material";
import styles from "./__form-input-field.module.css";
import { sxMUI } from "./__form-input-MUI";

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

  const isSmall = useMediaQuery("(max-width: 765px)");

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
    page === "admin-auth" ||
    page === "add-review-modal"
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
      <div
        className={form_control}
        style={{ marginRight: page === "user-sign-up" ? "10px" : "0" }}
      >
        <FormControl error={showError} sx={{ width: "100%" }}>
          <InputLabel
            htmlFor={inputLabel}
            sx={{ fontSize: isSmall ? "14px" : "20px" }}
          >
            {inputLabel}
          </InputLabel>
          <OutlinedInput
            type={type}
            required
            multiline={page === "add-review-modal"}
            name={inputName}
            value={inputValue}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            disabled={isDisabled}
            label={inputLabel}
            error={showError}
            className={styles.input_box_shadow}
            sx={isSmall ? sxMUI.input_box_small : sxMUI.input_box}
          />
        </FormControl>
        <FormHelperText sx={sxMUI.input_error}>
          {authError}
          {inputError}
        </FormHelperText>
      </div>
    </Grid>
  );
}

export default memo(FormInputField);
