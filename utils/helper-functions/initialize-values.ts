import { InputValues } from "./input-error-check";

export const initializeValues = (inputFieldsArray: string[]) => {
  let initialValues: InputValues = {};
  for (let name of inputFieldsArray) {
    initialValues = { ...initialValues, [name]: "" };
  }
  return initialValues;
};
