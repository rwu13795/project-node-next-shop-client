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
): boolean => {
  let hasError = false;
  if (touched[inputName] && value === "") {
    setErrors((prev) => {
      return { ...prev, [inputName]: "Required field" };
    });
    hasError = true;
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
          hasError = true;
          console.log("hasError in bad email", hasError);
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
          hasError = true;
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
          hasError = true;
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
          hasError = true;
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
          hasError = true;
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
          hasError = true;
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
          hasError = true;
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
          hasError = true;
        }
        break;
      }
      default:
        break;
    }
  }

  return hasError;
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

// the inputName is used as the "id" of the inputField, so if there is error on
// that field, onSubmitCheck will scroll the "view" to that field
export const onSubmitErrorCheck = (
  inputValues: InputValues,
  // errors: Errors,
  setInputErrors: Dispatch<SetStateAction<Errors>>
): string => {
  let errorInputField = "";
  let hasError = false;
  // set errors on all the empty fields
  for (let [inputName, value] of Object.entries(inputValues)) {
    if (value === "") {
      setInputErrors((prev) => {
        return { ...prev, [inputName]: "Required field" };
      });
      hasError = true;
      errorInputField = inputName;
    }
  }

  return errorInputField;

  // for (let [inputName, error] of Object.entries(errors)) {
  //   if (error !== "") return inputName;
  // }

  // return errorInputField;
};

export const onFormEnterSubmitCheck = (
  inputValues: InputValues,
  touched: Touched,
  setInputErrors: Dispatch<SetStateAction<Errors>>
): string => {
  let hasError = false;
  for (let [inputName, value] of Object.entries(inputValues)) {
    // onBlurCheck cannot detect the error on the input fields if user
    // hit "enter" to sumbit the form, so I have to check the error here again
    if (touched[inputName] === undefined) {
      touched[inputName] = true;
    }
    hasError = onBlurErrorCheck(inputName, value, touched, setInputErrors);
    if (hasError) return inputName;
  }
  return "";
};

export const finalCheck = (
  inputValues: InputValues,
  touched: Touched,
  setInputErrors: Dispatch<SetStateAction<Errors>>
): string => {
  let errorInput = "";
  errorInput = onSubmitErrorCheck(inputValues, setInputErrors);
  if (errorInput !== "") return errorInput;

  errorInput = onFormEnterSubmitCheck(inputValues, touched, setInputErrors);
  return errorInput;
};
