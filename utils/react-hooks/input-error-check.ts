import { Dispatch, SetStateAction } from "react";
import { inputNames } from "../enums-types/input-names";

export interface InputValue {
  [inputNames: string]: string;
}

export interface Touched {
  [inputNames: string]: boolean;
}
export interface Errors {
  [inputNames: string]: string;
}

export const onFocusErrorCheck = (
  inputName: string,
  setTouched: Dispatch<SetStateAction<Touched>>
) => {
  setTouched((prev) => {
    return { ...prev, [inputName]: true };
  });
};

export const onBlurErrorCheck = (
  inputName: string,
  value: string,
  touched: Touched,
  setErrors: Dispatch<SetStateAction<Errors>>
) => {
  if (touched[inputName] && value === "") {
    setErrors((prev) => {
      return { ...prev, [inputName]: "Required field" };
    });
  }

  if (touched[inputName] && inputName === inputNames.email && value !== "") {
    const regex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(value.toLowerCase())) {
      setErrors((prev) => {
        return { ...prev, [inputNames.email]: "Enter a valid email address." };
      });
    }
  }
};

export const onChangeErrorCheck = (
  inputName: string,
  value: string,
  setErrors: Dispatch<SetStateAction<Errors>>
) => {
  if (value !== "") {
    setErrors((prev) => {
      return { ...prev, [inputName]: "" };
    });
  }
};

export const onSubmitErrorCheck = (
  input: InputValue,
  errors: Errors,
  setError: Dispatch<SetStateAction<Errors>>
): boolean => {
  let hasError = false;
  for (let [inputName, value] of Object.entries(input)) {
    if (value === "") {
      setError((prev) => {
        return { ...prev, [inputName]: "Required field" };
      });
      hasError = true;
    }
  }
  if (hasError) return hasError;

  for (let error of Object.values(errors)) {
    if (error !== "") return true;
  }
  return false;
};
