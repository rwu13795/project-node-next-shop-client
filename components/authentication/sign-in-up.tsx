import React, { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../util/react-hooks/input-error-check";
import { inputNames } from "../../util/enums/input-names";
import { Touched, Errors } from "../../util/react-hooks/input-error-check";
import {
  selectSignInErrors,
  clearSignInErrors,
  clearSignUpErrors,
  signIn,
  signUp,
  selectSignUpErrors,
  selectSignUpStatus,
} from "../../store/authSlice";
import AuthInputField from "./input-field";
import Redirect_signedUp_to_homePage from "./redirect-signed-up";

interface Props {
  is_signingIn: boolean;
  handleClose?: () => void;
}

export default function SignIn_SignUp({
  is_signingIn,
  handleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const signInErrors = useSelector(selectSignInErrors);
  const signUpErrors = useSelector(selectSignUpErrors);
  const signUpStatus = useSelector(selectSignUpStatus);

  const [inputFieldsArray, setInputFieldsArray] = useState<string[]>(
    is_signingIn
      ? [inputNames.email, inputNames.password]
      : [
          inputNames.email,
          inputNames.password,
          inputNames.confirm_password,
          inputNames.first_name,
          inputNames.last_name,
        ]
  );

  // since these interfaces only contain [signature: string] as propperties keys
  // we just need to initialize a empty object to use the "computed property"
  // Except //
  // for the inputValue in the input elements, we must initialize the object with the
  // keys and values, otherwise when the value changes, React will show
  // warning: A component is changing an uncontrolled input to be controlled
  const [inputValue, setInputValue] = useState<InputValue>(
    is_signingIn
      ? {
          [inputNames.email]: "",
          [inputNames.password]: "",
        }
      : {
          [inputNames.email]: "",
          [inputNames.password]: "",
          [inputNames.confirm_password]: "",
          [inputNames.first_name]: "",
          [inputNames.last_name]: "",
        }
  );
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

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

    if (is_signingIn) dispatch(clearSignInErrors(name));
    else dispatch(clearSignUpErrors(name));

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

  return is_signingIn ? (
    <main>
      {inputFieldsArray.map((inputName) => {
        return (
          <AuthInputField
            key={inputName}
            inputName={inputName}
            inputValue={inputValue[inputName]}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            authError={signInErrors[inputName]}
            inputError={errors[inputName]}
          />
        );
      })}
      <div>
        <button onClick={singInHandler}>Sign In</button>
      </div>
      <hr />
      <div>
        <Link href="/auth/sign-up">
          <a onClick={handleClose}>Create a new account</a>
        </Link>
      </div>
    </main>
  ) : signUpStatus === "pending" ? (
    <main>
      {inputFieldsArray.map((inputName) => {
        return (
          <AuthInputField
            key={inputName}
            inputName={inputName}
            inputValue={inputValue[inputName]}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
            authError={signUpErrors[inputName]}
            inputError={errors[inputName]}
          />
        );
      })}
      <div>
        <button onClick={singUpHandler}>CREATE ACCOUNT</button>
      </div>
    </main>
  ) : (
    <Redirect_signedUp_to_homePage />
  );
}
