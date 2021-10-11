import { useState, FocusEvent, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, SelectChangeEvent } from "@mui/material";

import { inputNames } from "../../../utils/enums-types/input-names";
import {
  Errors,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
  Touched,
} from "../../../utils/helper-functions/input-error-check";
import {
  AuthErrors,
  clearAuthErrors,
  resetPassword,
  selectAuthErrors,
  selectLoadingStatus_user,
} from "../../../utils/redux-store/userSlice";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import { initializeValues } from "../../../utils/helper-functions/initialize-values";

const inputFieldsArray = [
  inputNames.old_password,
  inputNames.new_password,
  inputNames.confirm_new_password,
];

let initialValues = initializeValues(inputFieldsArray);

export default function ResetPassword({}): JSX.Element {
  const dispatch = useDispatch();
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const authErorrs = useSelector(selectAuthErrors);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [inputValue, setInputValue] = useState<InputValues>(initialValues);

  useEffect(() => {
    if (loadingStatus === "reset_password_succeeded") {
      setInputValue(initialValues);
    }
  }, [loadingStatus]);

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setInputErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    dispatch(clearAuthErrors(name));
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const resetHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValue,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;

    dispatch(
      resetPassword({
        old_password: inputValue[inputNames.old_password],
        new_password: inputValue[inputNames.new_password],
        confirm_new_password: inputValue[inputNames.confirm_new_password],
      })
    );
  };

  const inputFields = () => {
    return renderInputFields(
      inputFieldsArray,
      inputValue,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      authErorrs
    );
  };

  return (
    <main>
      {loadingStatus === "reset_password_succeeded" && (
        <div>Password has been reset successfully</div>
      )}
      {inputFields()}
      <button onClick={resetHandler} disabled={loadingStatus === "loading"}>
        Reset
      </button>
      {loadingStatus === "loading" && <CircularProgress />}
    </main>
  );
}
