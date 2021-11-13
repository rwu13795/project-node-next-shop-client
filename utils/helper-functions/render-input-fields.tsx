import { FocusEvent, ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import { inputNames } from "../enums-types/input-names";
import { Errors, InputValues } from "./input-error-check";
import FormInputField from "../../components/forms/form-input-field";
import SelectState from "../../components/forms/select-state-field";
import SelectSize from "../../components/forms/select-size-field";
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
  requestErrors?: AuthErrors | AdminErrors,
  isDisabled?: boolean
): JSX.Element[] {
  return fieldsArray.map((inputName) => {
    let content;
    switch (inputName) {
      case inputNames.state: {
        content = (
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
        break;
      }
      case inputNames.size: {
        content = (
          <div key={inputName}>
            <SelectSize
              value={inputValues[inputName]}
              inputName={inputName}
              onFocusHandler={onFocusHandler}
              onBlurHandler={onBlurHandler}
              onChangeHandler={onChangeHandler}
            />
            {inputErrors[inputName]}
          </div>
        );
        break;
      }
      default: {
        content = (
          <FormInputField
            key={inputName}
            inputName={inputName}
            inputValue={inputValues[inputName]}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            authError={requestErrors ? requestErrors[inputName] : ""}
            inputError={inputErrors[inputName]}
            isDisabled={isDisabled}
          />
        );
        break;
      }
    }

    return content;
  });
}
