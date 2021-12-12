import { FocusEvent, ChangeEvent, memo } from "react";
import { SelectChangeEvent } from "@mui/material";

import { inputNames } from "../enums-types/input-names";
import { Errors, InputValues } from "./input-error-check";
import FormInputField from "../../components/forms/form-input-field";
import SelectState from "../../components/forms/select-state-field";
import SelectSize_2 from "../../components/forms/select-size-field";
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
  isDisabled?: boolean,
  page?: string
): JSX.Element[] {
  return fieldsArray.map((inputName) => {
    let content;
    switch (inputName) {
      case inputNames.state: {
        content = (
          <SelectState
            key={inputName}
            value={inputValues[inputName]}
            inputName={inputName}
            onFocusHandler={onFocusHandler}
            onBlurHandler={onBlurHandler}
            onChangeHandler={onChangeHandler}
            inputError={inputErrors[inputName]}
            page={page}
          />
        );
        break;
      }
      case inputNames.size: {
        content = (
          <SelectSize_2
            key={inputName}
            value={inputValues[inputName]}
            inputName={inputName}
            onFocusHandler={onFocusHandler}
            onBlurHandler={onBlurHandler}
            onChangeHandler={onChangeHandler}
            inputError={inputErrors[inputName]}
          />
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
            page={page}
          />
        );
        break;
      }
    }

    return content;
  });
}
