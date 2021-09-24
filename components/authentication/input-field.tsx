import { ChangeEvent, FocusEvent } from "react";

interface Props {
  inputName: string;
  inputValue: string;
  onFocus: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  authError: string;
  inputError: string;
}

export default function AuthInputField(props: Props) {
  const {
    inputName,
    inputValue,
    onFocus,
    onBlur,
    onChange,
    authError,
    inputError,
  } = props;
  return (
    <div>
      <label>{inputName.replace("_", " ").toUpperCase()}</label>
      <input
        type={inputName === "confirm_password" ? "password" : inputName}
        required
        name={inputName}
        value={inputValue}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={onChange}
      ></input>
      <span>
        {authError}
        {inputError}
      </span>
    </div>
  );
}
