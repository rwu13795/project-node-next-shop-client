import { ChangeEvent, FocusEvent } from "react";
import { inputNames } from "../../../utils/enums-types/input-names";

interface Props {
  inputName: string;
  inputValue: string;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputError: string;
  authError?: string;
  isDisabled?: boolean;
}

export default function FormInputField(props: Props): JSX.Element {
  const {
    inputName,
    inputValue,
    onFocus,
    onBlur,
    onChange,
    authError,
    inputError,
    isDisabled,
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

  const regex = /[_]/g;

  return (
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
  );
}
