import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  memo,
  useCallback,
  Fragment,
} from "react";
import { useDispatch } from "react-redux";

import { SelectChangeEvent } from "@mui/material";

import {
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import {
  Touched,
  Errors,
} from "../../utils/helper-functions/input-error-check";
import { clearAuthErrors, AuthErrors } from "../../utils/redux-store/userSlice";

import { inputTypes } from "../../utils/enums-types/input-types";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import {
  AdminErrors,
  clearAdminErrors,
} from "../../utils/redux-store/adminSlice";
import UserSignIn from "./user-sign-in";
import UserSignUp from "./user-sign-up";
import AdminSignIn from "../admin/admin-sign-in";
import AdminRegister from "../admin/admin-register";
import UserForgotPassword from "./forgot-password";
import { initializeValues } from "../../utils/helper-functions/initialize-values";
import { inputNames } from "../../utils/enums-types/input-names";

interface Props {
  inputType: string; // "signIn" | "signUp"
  inputFieldsArray: string[]; // contains inputNames
  page?: string;
  signInModal?: boolean;
  modalHandleClose?: () => void; // MUI modal function to close the modal
}

function AuthForm({
  inputType,
  inputFieldsArray,
  page,
  signInModal,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  // since these interfaces only contain [signature: string] as propperties keys
  // I just need to initialize a empty object to use the "computed property"
  // Except //
  // for the inputValue in the input elements, I must initialize the object with the
  // keys and values, otherwise when the value changes, React will show
  // warning: A component is changing an uncontrolled input to be controlled
  const [inputValues, setInputValue] = useState<InputValues>(() => {
    return initializeValues(inputFieldsArray);
  });

  const onFocusHandler = useCallback((e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    if (name === inputNames.address_2) return;

    onFocusErrorCheck(name, setTouched);
  }, []);

  const onBlurHandler = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      if (name === inputNames.address_2) return;

      onBlurErrorCheck(name, value, touched, setInputErrors);
    },
    [touched]
  );

  const onChangeHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
      const { name, value } = e.target;

      if (
        name === inputNames.password ||
        name === inputNames.confirm_password
      ) {
        dispatch(clearAuthErrors(inputNames.password));
        dispatch(clearAuthErrors(inputNames.confirm_password));
        dispatch(clearAdminErrors(inputNames.password));
        dispatch(clearAdminErrors(inputNames.confirm_password));
      } else {
        dispatch(clearAuthErrors(name));
        dispatch(clearAdminErrors(name));
      }

      setInputValue((prev) => {
        return { ...prev, [name]: value };
      });

      if (name === inputNames.address_2) return;
      onChangeErrorCheck(name, value, setInputErrors);
    },
    [dispatch]
  );

  const inputFields = useCallback(
    (
      fields: string[],
      inputValues: InputValues,
      requestErrors: AuthErrors | AdminErrors,
      page?: string
    ) => {
      return renderInputFields(
        fields,
        inputValues,
        onFocusHandler,
        onBlurHandler,
        onChangeHandler,
        inputErrors,
        requestErrors,
        false,
        page
      );
    },
    [inputErrors, onBlurHandler, onChangeHandler, onFocusHandler]
  );

  const propsForChild = {
    inputFieldsArray,
    inputValues,
    inputErrors,
    setInputErrors,
    inputFields,
    modalHandleClose,
    page,
    signInModal,
    touched,
  };

  let content;
  switch (inputType) {
    case inputTypes.signIn: {
      content = <UserSignIn {...propsForChild} />;
      break;
    }
    case inputTypes.signUp: {
      content = <UserSignUp {...propsForChild} />;
      break;
    }

    case inputTypes.adminSignIn: {
      content = <AdminSignIn {...propsForChild} />;
      break;
    }
    case inputTypes.adminRegister: {
      content = <AdminRegister {...propsForChild} />;
      break;
    }
    case inputTypes.forgotPassword: {
      content = <UserForgotPassword {...propsForChild} />;
    }
    default:
      break;
  }

  return <Fragment>{content}</Fragment>;
}

export default memo(AuthForm);
