import { useState, FocusEvent, ChangeEvent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SelectChangeEvent } from "@mui/material";

import {
  Errors,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
  Touched,
} from "../../../utils/helper-functions/input-error-check";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";

import {
  clearAuthErrors,
  forgotPassword_Reset,
  selectAuthErrors,
  selectLoadingStatus_user,
} from "../../../utils/redux-store/userSlice";
import { inputNames } from "../../../utils/enums-types/input-names";
import { initializeValues } from "../../../utils/helper-functions/initialize-values";
import { loadingStatus } from "../../../utils/enums-types/loading-status";
import Redirect_to_signIn from "../redirect-to-sign-In";

interface Props {
  userId: string;
  token: string;
  expiration: number;
}

const inputFieldsArray = [
  inputNames.new_password,
  inputNames.confirm_new_password,
];

const initialValues = initializeValues(inputFieldsArray);

export default function ForgotPasswordReset({
  userId,
  token,
  expiration,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const [second, setSecond] = useState<number>(
    Math.floor((expiration / 1000) % 60) - 1
  );
  const [minute, setMinute] = useState<number>(
    Math.floor(expiration / 1000 / 60)
  );
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [inputValues, setInputValues] = useState<InputValues>(initialValues);

  console.log(second);

  useEffect(() => {
    if (isExpired || loadingStatus_user === loadingStatus.succeeded) {
      dispatch(clearAuthErrors("all"));
      setInputValues(initialValues);
    }
  }, [isExpired, loadingStatus_user, dispatch]);

  useEffect(() => {
    const countDown = () => {
      if (second > 0) {
        setSecond((prevSec) => prevSec - 1);
      }
      if (second === 0) {
        if (minute === 0) {
          setIsExpired(true);
          return () => {
            clearInterval(timerId);
          };
        } else {
          setSecond(59);
          setMinute((prevMin) => prevMin - 1);
        }
      }
    };

    const timerId = setInterval(countDown, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [second, minute, expiration]);

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
    console.log(name);
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
  };

  const inputFields = () => {
    return renderInputFields(
      inputFieldsArray,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      authErrors,
      isExpired
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
          disabled={loadingStatus_user === loadingStatus.succeeded || isExpired}
        >
          SUBMIT
        </button>
      </div>

      {loadingStatus_user === loadingStatus.succeeded && (
        <Redirect_to_signIn resetSuccess={true} />
      )}

      {isExpired ? (
        <h3>Session time out</h3>
      ) : (
        <div>
          {`0${minute}`}:{second > 9 ? second : `0${second}`}
        </div>
      )}
    </div>
  );
}
