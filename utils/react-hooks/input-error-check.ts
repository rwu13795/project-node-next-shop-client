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
        return {
          ...prev,
          [inputNames.email]: "Please enter a valid email address",
        };
      });
    }
  }

  if (touched[inputName]) {
    const regex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~123456789]/;
    if (inputName === inputNames.first_name && value !== "") {
      if (regex.test(value)) {
        setErrors((prev) => {
          return {
            ...prev,
            [inputNames.first_name]: "Please enter a valid name",
          };
        });
      }
    }
    if (inputName === inputNames.last_name && value !== "") {
      if (regex.test(value)) {
        setErrors((prev) => {
          return {
            ...prev,
            [inputNames.last_name]: "Please enter a valid name",
          };
        });
      }
    }
  }

  if (touched[inputName]) {
    const regex = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
    if (inputName === inputNames.address_1 && value !== "") {
      if (regex.test(value)) {
        setErrors((prev) => {
          return {
            ...prev,
            [inputNames.address_1]: "Please enter a valid address",
          };
        });
      }
    }
    if (inputName === inputNames.address_2 && value !== "") {
      if (regex.test(value)) {
        setErrors((prev) => {
          return {
            ...prev,
            [inputNames.address_2]: "Please enter a valid address",
          };
        });
      }
    }
  }

  if (touched[inputName] && inputName === inputNames.zip_code && value !== "") {
    const regex = /^[0-9]{5}$/;
    if (!regex.test(value)) {
      setErrors((prev) => {
        return {
          ...prev,
          [inputNames.zip_code]: "Zipcode should be 5-digit numbers",
        };
      });
    }
  }

  if (touched[inputName] && inputName === inputNames.phone && value !== "") {
    const regex = /^[0-9]{9,15}$/;
    if (!regex.test(value)) {
      setErrors((prev) => {
        return {
          ...prev,
          [inputNames.phone]: "Please enter valid phone numbers",
        };
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
