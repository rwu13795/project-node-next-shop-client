import { Dispatch, SetStateAction } from "react";
import { inputNames } from "../enums-types/input-names";

export interface InputValues {
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

  if (touched[inputName] && value !== "") {
    const regex_email =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const regex_name = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~123456789]/;
    const regex_address = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
    const regex_zipcode = /^[0-9]{5}$/;
    const regex_phone = /^[0-9]{9,15}$/;

    switch (inputName) {
      case inputNames.email: {
        if (!regex_email.test(value.toLowerCase())) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.email]: "Please enter a valid email address",
            };
          });
        }
        break;
      }
      case inputNames.first_name: {
        if (regex_name.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.first_name]: "Please enter a valid name",
            };
          });
        }
        break;
      }
      case inputNames.last_name: {
        if (regex_name.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.last_name]: "Please enter a valid name",
            };
          });
        }
        break;
      }
      case inputNames.address_1: {
        if (regex_address.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.address_1]: "Please enter a valid address",
            };
          });
        }
        break;
      }
      case inputNames.address_2: {
        if (regex_address.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.address_2]: "Please enter a valid address",
            };
          });
        }
        break;
      }
      case inputNames.city: {
        if (regex_address.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.city]: "Please enter a valid address",
            };
          });
        }
        break;
      }
      case inputNames.zip_code: {
        if (!regex_zipcode.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.zip_code]: "Zipcode should be 5-digit numbers",
            };
          });
        }
        break;
      }
      case inputNames.phone: {
        if (!regex_phone.test(value)) {
          setErrors((prev) => {
            return {
              ...prev,
              [inputNames.phone]: "Please enter valid phone numbers",
            };
          });
        }
        break;
      }
      default:
        break;
    }
  }
};

export const onChangeErrorCheck = (
  inputName: string,
  value: string,
  setErrors: Dispatch<SetStateAction<Errors>>
) => {
  if (value !== "" || value !== undefined) {
    setErrors((prev) => {
      return { ...prev, [inputName]: "" };
    });
  }
};

export const onSubmitErrorCheck = (
  input: InputValues,
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
