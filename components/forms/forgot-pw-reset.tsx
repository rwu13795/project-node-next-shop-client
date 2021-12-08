import React, {
  useState,
  FocusEvent,
  ChangeEvent,
  useEffect,
  memo,
  Fragment,
  FormEvent,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { SelectChangeEvent } from "@mui/material";

import {
  Errors,
  finalCheck,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onFormEnterSubmitCheck,
  onSubmitErrorCheck,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import renderInputFields from "../../utils/helper-functions/render-input-fields";

import {
  clearAuthErrors,
  forgotPassword_Reset,
  selectAuthErrors,
  selectLoadingStatus_user,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { initializeValues } from "../../utils/helper-functions/initialize-values";
import { loadingStatus } from "../../utils/enums-types/loading-status";
import Redirect_to_signIn from "../auth/redirect-to-sign-In";

// UI //
import { Button } from "@mui/material";
import styles from "./__forgot-pw-reset.module.css";

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

function ForgotPasswordReset({
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

  const resetPasswordHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

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
      isExpired,
      "user-sign-in"
    );
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.main_title}>CREATE A NEW PASSWORD</div>
        <div className={styles.reset_pw_container}>
          <form onSubmit={resetPasswordHandler}>
            <div className={styles.input_fields}>{inputFields()}</div>

            <Button
              type="submit"
              variant="contained"
              onClick={resetPasswordHandler}
              disabled={
                loadingStatus_user === loadingStatus.succeeded || isExpired
              }
              className={styles.submit_button}
            >
              SUBMIT
            </Button>
          </form>
        </div>

        <div className={styles.text_indicator}>
          {loadingStatus_user === loadingStatus.succeeded ? (
            <Redirect_to_signIn resetSuccess={true} />
          ) : (
            <div className={styles.sub_title}>
              {isExpired ? (
                <Fragment>
                  Session time out, please make a{" "}
                  <Link href={"/auth/forgot-password"}>NEW REQUEST</Link> again
                </Fragment>
              ) : (
                <Fragment>
                  Session expires in
                  {` 0${minute}`}:{second > 9 ? second : `0${second}`}
                </Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default memo(ForgotPasswordReset);
