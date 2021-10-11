import { FocusEvent, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import { inputNames } from "../enums-types/input-names";
import { Errors, InputValues } from "./input-error-check";
import FormInputField from "../../components/auth/form-input-field";
import SelectState from "../../components/auth/select-state";
import { AuthErrors } from "../redux-store/userSlice";
import { AdminErrors } from "../redux-store/adminSlice";

export default function renderInputFields(
  fieldsArray: string[],
  inputValues: InputValues,
  onFocusHandler: (e: FocusEvent<HTMLInputElement>) => void,
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void,
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void,
  inputErrors: Errors,
  requestErrors?: AuthErrors | AdminErrors
): JSX.Element[] {
  return fieldsArray.map((inputName) => {
    return inputName !== inputNames.state ? (
      <FormInputField
        key={inputName}
        inputName={inputName}
        inputValue={inputValues[inputName]}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
        authError={requestErrors ? requestErrors[inputName] : ""}
        inputError={inputErrors[inputName]}
      />
    ) : (
      <div key={inputName}>
        <SelectState
          value={inputValues[inputName]}
          inputName={inputName}
          onFocusHandler={onFocusHandler}
          onBlurHandler={onBlurHandler}
          onChangeHandler={onChangeHandler}
        />
        {inputErrors[inputName]}
      </div>
    );
  });
}
