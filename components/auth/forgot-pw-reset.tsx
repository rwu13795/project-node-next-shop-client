import {
  Dispatch,
  SetStateAction,
  useState,
  FocusEvent,
  ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import {
  Errors,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import {
  AuthErrors,
  clearAuthErrors,
  forgotPassword_Reset,
  selectAuthErrors,
  selectLoadingStatus_user,
  setLoadingStatus,
  signIn,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import browserClient from "../../utils/axios-client/browser-client";
import { initializeValues } from "../../utils/helper-functions/initialize-values";
import { loadingStatus } from "../../utils/enums-types/loading-status";

interface Props {
  userId: string;
  token: string;
}

const inputFieldsArray = [
  inputNames.new_password,
  inputNames.confirm_new_password,
];

const initialValues = initializeValues(inputFieldsArray);

export default function ForgotPasswordReset({
  userId,
  token,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [inputValues, setInputValues] = useState<InputValues>(initialValues);

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
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const resetPasswordHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      forgotPassword_Reset({
        userId,
        token,
        new_password: inputValues[inputNames.new_password],
        confirm_new_password: inputValues[inputNames.confirm_new_password],
      })
    );
    setInputValues(initialValues);
  };

  const inputFields = () => {
    return renderInputFields(
      inputFieldsArray,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      authErrors
    );
  };

  return (
    <div>
      <div>
        <h4>Create a new password</h4>
      </div>
      <div>{inputFields()}</div>
      <div>
        <button
          onClick={resetPasswordHandler}
          disabled={loadingStatus_user === loadingStatus.succeeded}
        >
          SUBMIT
        </button>
      </div>
      <div>
        {loadingStatus_user === loadingStatus.succeeded &&
          "Password reset successfully"}
      </div>
    </div>
  );
}
