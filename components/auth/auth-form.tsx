import React, { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import {
  Touched,
  Errors,
} from "../../utils/helper-functions/input-error-check";
import {
  signIn,
  signUp,
  clearAuthErrors,
  selectAuthErrors,
  selectLoadingStatus_user,
  AuthErrors,
} from "../../utils/redux-store/userSlice";
import Redirect_signedUp_to_homePage from "./redirect-signed-up";
import { inputTypes } from "../../utils/enums-types/input-types";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import {
  AdminErrors,
  adminRegister,
  adminSignIn,
  clearAdminErrors,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";

interface Props {
  inputType: string; // "signIn" | "signUp"
  inputFieldsArray: string[]; // contains inputNames
  modalHandleClose?: () => void; // MUI modal function to close the modal
}

export default function AuthForm({
  inputType,
  inputFieldsArray,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  // since these interfaces only contain [signature: string] as propperties keys
  // I just need to initialize a empty object to use the "computed property"
  // Except //
  // for the inputValue in the input elements, I must initialize the object with the
  // keys and values, otherwise when the value changes, React will show
  // warning: A component is changing an uncontrolled input to be controlled
  const [inputValue, setInputValue] = useState<InputValue>(() => {
    let initialValue: InputValue = {};
    for (let name of inputFieldsArray) {
      initialValue = { ...initialValue, [name]: "" };
    }
    return initialValue;
  });

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;

    dispatch(clearAuthErrors(name));
    dispatch(clearAdminErrors(name));
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setErrors);
  };

  /* * *  User sign in/up   * * */
  const singInHandler = () => {
    const hasError = onSubmitErrorCheck(inputValue, errors, setErrors);
    if (hasError) return;
    dispatch(
      signIn({ email: inputValue.email, password: inputValue.password })
    );
  };
  const singUpHandler = () => {
    const hasError = onSubmitErrorCheck(inputValue, errors, setErrors);
    if (hasError) return;
    dispatch(
      signUp({
        email: inputValue[inputNames.email],
        password: inputValue[inputNames.password],
        confirm_password: inputValue[inputNames.confirm_password],
        userInfo: {
          first_name: inputValue[inputNames.first_name],
          last_name: inputValue[inputNames.last_name],
          phone: inputValue[inputNames.phone],
          address_1: inputValue[inputNames.address_1],
          address_2: inputValue[inputNames.address_2],
          city: inputValue[inputNames.city],
          state: inputValue[inputNames.state],
          zip_code: inputValue[inputNames.zip_code],
        },
      })
    );
  };

  /* * *  Admin sign in/up   * * */
  const adminSignInHandler = () => {
    const hasError = onSubmitErrorCheck(inputValue, errors, setErrors);
    if (hasError) return;
    console.log("adminSignIn");
    dispatch(
      adminSignIn({
        admin_id: inputValue[inputNames.admin_id],
        password: inputValue[inputNames.password],
      })
    );
  };
  const adminRegisterHandler = () => {
    const hasError = onSubmitErrorCheck(inputValue, errors, setErrors);
    if (hasError) return;
    dispatch(
      adminRegister({
        admin_id: inputValue[inputNames.admin_id],
        password: inputValue[inputNames.password],
        confirm_password: inputValue[inputNames.confirm_password],
      })
    );
  };

  const inputFields = (
    fields: string[],
    inputValue: InputValue,
    requestError: AuthErrors | AdminErrors
  ) => {
    return renderInputFields(
      fields,
      inputValue,
      errors,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      requestError
    );
  };

  let content;
  switch (inputType) {
    case inputTypes.signIn: {
      content = (
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
        </div>
      );
      break;
    }
    case inputTypes.signUp: {
      content =
        loadingStatus_user !== "succeeded" ? (
          <div>
            <Link href="/auth/sign-in">
              <a>
                <Button variant="contained">Sign In</Button>
              </a>
            </Link>
            <span> Have a existing account?</span>
            <hr />
            {inputFields(inputFieldsArray, inputValue, authErrors)}
            <div>
              <Button
                variant="contained"
                onClick={singUpHandler}
                disabled={loadingStatus_user !== "idle"}
              >
                CREATE ACCOUNT
              </Button>
            </div>
            {loadingStatus_user === "loading" && <CircularProgress />}
          </div>
        ) : (
          <Redirect_signedUp_to_homePage />
        );
      break;
    }
    case inputTypes.adminSignIn: {
      content = (
        <div>
          {inputFields(inputFieldsArray, inputValue, adminErrors)}
          <div>
            <button
              onClick={adminSignInHandler}
              disabled={loadingStatus_admin === "loading"}
            >
              Sign In
            </button>
            {loadingStatus_admin === "loading" && (
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
        </div>
      );
      break;
    }
    case inputTypes.adminRegister: {
      content = (
        <div>
          {inputFields(inputFieldsArray, inputValue, adminErrors)}
          <div>
            <button
              onClick={adminRegisterHandler}
              disabled={loadingStatus_admin === "loading"}
            >
              Register
            </button>
            {loadingStatus_admin === "loading" && (
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
        </div>
      );
      break;
    }
    default:
      break;
  }

  return <main>{content}</main>;
}
