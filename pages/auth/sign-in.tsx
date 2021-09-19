import type { NextPage } from "next";
import { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
} from "../../util/react-hooks/onChange-error-check";
import { inputNames } from "../../util/enums/input-names";
import { Touched, Errors } from "../../util/react-hooks/onChange-error-check";
import {
  selectErros,
  selectIsLoggedIn,
  signIn,
  clearSignInErrors,
} from "../../store/authSlice";

const SignIn: NextPage = ({}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const signInErrors = useSelector(selectErros);

  // since these interfaces only contain [signature: string] as propperties keys
  // we just need to initialize a empty object to use the "computed property"
  // Except //
  // for the inputValue in the input elements, we must initialize the object with the
  // keys and values, otherwise when the value changes, React will show
  // warning: A component is changing an uncontrolled input to be controlled
  const [inputValue, setInputValue] = useState<InputValue>({
    [inputNames.email]: "",
    [inputNames.password]: "",
  });
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
    dispatch(clearSignInErrors(name));
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setErrors);
  };

  return (
    <main>
      <div>
        <label>Email</label>
        <input
          type={inputNames.email}
          required
          name={inputNames.email}
          value={inputValue[inputNames.email]}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          onChange={onChangeHandler}
        ></input>
        <span>
          {signInErrors[inputNames.email]}
          {errors[inputNames.email]}
        </span>
      </div>
      <div>
        <label>Password</label>
        <input
          type={inputNames.password}
          required
          name={inputNames.password}
          value={inputValue[inputNames.password]}
          onBlur={onBlurHandler}
          onFocus={onFocusHandler}
          onChange={onChangeHandler}
        ></input>
        <span>
          {signInErrors[inputNames.password]}
          {errors[inputNames.password]}
        </span>
      </div>
      <div>
        <button
          onClick={() =>
            dispatch(
              signIn({ email: inputValue.email, password: inputValue.password })
            )
          }
        >
          Sign In
        </button>
      </div>
      <div>{isLoggedIn ? "You are signed in" : "You are NOT signed in"}</div>
    </main>
  );
};

export default SignIn;
