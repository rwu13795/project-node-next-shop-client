import React, { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../utils/react-hooks/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import { Touched, Errors } from "../../utils/react-hooks/input-error-check";
import {
  signIn,
  signUp,
  clearAuthErrors,
  selectAuthErrors,
  selectLoadingStatus,
} from "../../utils/redux-store/userSlice";
import AuthInputField from "./input-field";
import Redirect_signedUp_to_homePage from "./redirect-signed-up";
import { inputTypes } from "../../utils/enums-types/input-types";
import { CircularProgress } from "@mui/material";

interface Props {
  inputType: string; // "signIn" | "signUp" | resetPassword" | "resetToken"
  inputFields: string[]; // contains inputNames
  handleClose?: () => void; // MUI modal function to close the modal
}

export default function AuthForm({
  inputType,
  inputFields,
  handleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus = useSelector(selectLoadingStatus);

  const [inputFieldsArray] = useState<string[]>(inputFields);
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
    for (let name of inputFields) {
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

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
        first_name: inputValue[inputNames.first_name],
        last_name: inputValue[inputNames.last_name],
      })
    );
  };

  const renderFields = () => {
    return inputFieldsArray.map((inputName) => {
      return (
        <AuthInputField
          key={inputName}
          inputName={inputName}
          inputValue={inputValue[inputName]}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          authError={authErrors[inputName]}
          inputError={errors[inputName]}
        />
      );
    });
  };

  let content;
  switch (inputType) {
    case inputTypes.signIn: {
      content = (
        <div>
          {renderFields()}
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
              <a onClick={handleClose}>Create a new account</a>
            </Link>
          </div>
        </div>
      );
      break;
    }
    case inputTypes.signUp: {
      content =
        loadingStatus !== "succeeded" ? (
          <div>
            {renderFields()}{" "}
            {loadingStatus === "loading" && <CircularProgress />}
            <div>
              <button
                onClick={singUpHandler}
                disabled={loadingStatus !== "idle"}
              >
                CREATE ACCOUNT
              </button>
            </div>
          </div>
        ) : (
          <Redirect_signedUp_to_homePage />
        );
      break;
    }
    case inputTypes.resetPassword: {
      break;
    }
    case inputTypes.resetToken: {
      break;
    }
  }

  return <main>{content}</main>;
}
