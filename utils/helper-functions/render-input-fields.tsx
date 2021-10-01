import { FocusEvent, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import { inputNames } from "../enums-types/input-names";
import { Errors, InputValue } from "./input-error-check";
import FormInputField from "../../components/auth/form-input-field";
import SelectState from "../../components/auth/select-state";
import { AuthErrors } from "../redux-store/userSlice";

export default function renderInputFields(
  fieldsArray: string[],
  inputValue: InputValue,
  errors: Errors,
  onFocusHandler: (e: FocusEvent<HTMLInputElement>) => void,
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void,
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void,
  authErrors?: AuthErrors
): JSX.Element[] {
  return fieldsArray.map((inputName) => {
    return inputName !== inputNames.state ? (
      <FormInputField
        key={inputName}
        inputName={inputName}
        inputValue={inputValue[inputName]}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        authError={authErrors ? authErrors[inputName] : ""}
        inputError={errors[inputName]}
      />
    ) : (
      <div key={inputName}>
        <SelectState
          value={inputValue[inputName]}
          inputName={inputName}
          onFocusHandler={onFocusHandler}
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
        {errors[inputName]}
      </div>
    );
  });
}
