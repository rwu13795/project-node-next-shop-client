import React, { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

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
  selectLoadingStatus,
} from "../../utils/redux-store/userSlice";
import Redirect_signedUp_to_homePage from "./redirect-signed-up";
import { inputTypes } from "../../utils/enums-types/input-types";
import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";
import renderInputFields from "../../utils/helper-functions/render-input-fields";

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
  const loadingStatus = useSelector(selectLoadingStatus);

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
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setErrors);
  };

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

  const inputFields = (fields: string[], inputValue: InputValue) => {
    return renderInputFields(
      fields,
      inputValue,
      errors,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      authErrors
    );
  };

  let content;
  if (inputType === inputTypes.signIn) {
    content = (
      <div>
        {inputFields(inputFieldsArray, inputValue)}
        <div>
          <button
            onClick={singInHandler}
            disabled={loadingStatus === "loading"}
          >
            Sign In
          </button>
          {loadingStatus === "loading" && (
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
  } else {
    content =
      loadingStatus !== "succeeded" ? (
        <div>
          <Link href="/auth/sign-in">
            <a>
              <Button variant="contained">Sign In</Button>
            </a>
          </Link>
          <span> Have a existing account?</span>
          <hr />
          {inputFields(inputFieldsArray, inputValue)}
          <div>
            <Button
              variant="contained"
              onClick={singUpHandler}
              disabled={loadingStatus !== "idle"}
            >
              CREATE ACCOUNT
            </Button>
          </div>
          {loadingStatus === "loading" && <CircularProgress />}
        </div>
      ) : (
        <Redirect_signedUp_to_homePage />
      );
  }

  return <main>{content}</main>;
}
