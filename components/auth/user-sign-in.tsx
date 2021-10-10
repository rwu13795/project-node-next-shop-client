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
  InputValue,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import {
  AuthErrors,
  selectAuthErrors,
  selectLoadingStatus_user,
  signIn,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";

interface Props {
  inputFieldsArray: string[];
  inputValue: InputValue;
  inputErrors: Errors;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValue: InputValue,
    requestError: AuthErrors | AdminErrors
  ) => JSX.Element[];
  modalHandleClose?: () => void; // MUI modal function to close the modal
}

export default function UserSignIn({
  inputFieldsArray,
  inputValue,
  inputErrors,
  setInputErrors,
  inputFields,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const [forgotPassword, setForgetPassword] = useState<boolean>(false);

  const singInHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValue,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      signIn({ email: inputValue.email, password: inputValue.password })
    );
  };

  const forgetPasswordHandler = () => {
    setInputErrors({});
    setForgetPassword(true);
  };

  const requestSubmitHandler = () => {};

  return !forgotPassword ? (
    <div>
      {inputFields(inputFieldsArray, inputValue, authErrors)}
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
      <div>{inputFields([inputNames.email], inputValue, authErrors)}</div>
      <div>
        <button onClick={requestSubmitHandler}>SUBMIT</button>
      </div>
    </div>
  );
}
