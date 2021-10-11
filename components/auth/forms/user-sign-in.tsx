import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Button, CircularProgress } from "@mui/material";

import {
  Errors,
  InputValues,
  onSubmitErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import { AdminErrors } from "../../../utils/redux-store/adminSlice";
import {
  AuthErrors,
  clearAuthErrors,
  forgotPassword_Request,
  selectAuthErrors,
  selectLoadingStatus_user,
  setLoadingStatus,
  signIn,
} from "../../../utils/redux-store/userSlice";
import { inputNames } from "../../../utils/enums-types/input-names";
import { loadingStatus } from "../../../utils/enums-types/loading-status";

interface Props {
  inputFieldsArray: string[];
  inputValues: InputValues;
  inputErrors: Errors;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValues: InputValues,
    requestError: AuthErrors | AdminErrors
  ) => JSX.Element[];
  modalHandleClose?: () => void; // MUI modal function to close the modal
}

export default function UserSignIn({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const [forgotPassword, setForgetPassword] = useState<boolean>(false);

  useEffect(() => {
    dispatch(setLoadingStatus("idle"));
    dispatch(clearAuthErrors("all"));
  }, [dispatch]);

  const singInHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      signIn({
        email: inputValues[inputNames.email],
        password: inputValues[inputNames.password],
      })
    );
  };

  const forgetPasswordHandler = () => {
    dispatch(setLoadingStatus("idle"));
    setInputErrors({});
    setForgetPassword(true);
  };

  const requestSubmitHandler = () => {
    dispatch(forgotPassword_Request(inputValues[inputNames.email]));
  };

  return !forgotPassword ? (
    <div>
      {inputFields(inputFieldsArray, inputValues, authErrors)}
      <div>
        <button
          onClick={singInHandler}
          disabled={loadingStatus_user === "loading"}
        >
          Sign In
        </button>
        {loadingStatus_user === "loading" && (
          <CircularProgress
            size={45}
            sx={{
              position: "absolute",
              top: "40%",
              left: "46%",
              // marginTop: "-12px",
              // marginLeft: "-12px",
            }}
          />
        )}
      </div>
      <hr />
      <div>
        <Link href="/auth/sign-up">
          <a onClick={modalHandleClose}>Create a new account</a>
        </Link>
      </div>
      <br />
      <div>
        <a onClick={forgetPasswordHandler}>Forgot password?</a>
      </div>
    </div>
  ) : (
    <div>
      <h3>RESET PASSWORD</h3>
      <div>1. ENTER THE EMAIL ADDRESS CONNECTED TO YOUR ACCOUNT</div>
      <div>2. CHECK YOUR INBOX FOR A MESSAGE FROM US.</div>
      <div>3. FOLLOW THE LINK TO RESET YOUR PASSWORD.</div>
      <hr />
      {loadingStatus_user === loadingStatus.succeeded && (
        <div>A link for resetting the password has been sent to your email</div>
      )}
      <div>{inputFields([inputNames.email], inputValues, authErrors)}</div>
      <div>
        <button
          onClick={requestSubmitHandler}
          disabled={loadingStatus_user === loadingStatus.succeeded}
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
}
