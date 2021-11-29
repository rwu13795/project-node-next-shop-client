import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  memo,
  MouseEvent,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  Errors,
  InputValues,
  onBlurErrorCheck,
  onFormEnterSubmitCheck,
  onSubmitErrorCheck,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import {
  AuthErrors,
  clearAuthErrors,
  forgotPassword_Request,
  selectAuthErrors,
  selectLoadingStatus_user,
  selectPageLoading_user,
  setLoadingStatus,
  signIn,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { loadingStatus } from "../../utils/enums-types/loading-status";
import {
  selectPageLoading,
  setPageLoading,
} from "../../utils/redux-store/layoutSlice";

// UI //
import { Button, CircularProgress, Grid } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./__user-sign-in.module.css";
import { useRouter } from "next/router";

interface Props {
  inputFieldsArray: string[];
  inputValues: InputValues;
  inputErrors: Errors;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValues: InputValues,
    requestError: AuthErrors | AdminErrors,
    page?: string
  ) => JSX.Element[];
  touched: Touched;
  signInModal?: boolean;
  page?: string;
  modalHandleClose?: () => void; // MUI modal function to close the modal
}

function UserSignIn({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
  touched,
  signInModal,
  page,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);
  const pageLoading = useSelector(selectPageLoading);

  useEffect(() => {
    dispatch(clearAuthErrors("all"));
    dispatch(setLoadingStatus("idle"));
  }, []);

  useEffect(() => {
    if (loadingStatus_user === "failed") {
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus_user, dispatch]);

  const singInHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let hasError = onSubmitErrorCheck(inputValues, inputErrors, setInputErrors);
    hasError = onFormEnterSubmitCheck(inputValues, touched, setInputErrors);
    if (hasError) return;

    if (!signInModal) {
      dispatch(setPageLoading(true));
    }
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
    if (modalHandleClose) {
      modalHandleClose();
    }
    router.push("/auth/forgot-password");
  };

  const toSignUpHandler = () => {
    if (modalHandleClose) modalHandleClose();
    router.push("/auth/sign-up");
  };

  if (signInModal) {
    return (
      <main className={styles.modal_main_container}>
        <div className={styles.modal_grid}>
          <div className={styles.modal_grid_upper}>
            <form onSubmit={singInHandler}>
              {inputFields(
                inputFieldsArray,
                inputValues,
                authErrors,
                "user-sign-in"
              )}
              <div className={styles.button_group}>
                <div
                  onClick={forgetPasswordHandler}
                  className={styles.forget_pw}
                >
                  FORGOT PASSWORD?
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={singInHandler}
                  disabled={loadingStatus_user === "loading"}
                  className={styles.sign_in_button}
                >
                  Sign In
                </Button>
              </div>
            </form>
          </div>

          <div className={styles.modal_grid_lower}>
            <Button
              variant="contained"
              onClick={toSignUpHandler}
              className={styles.to_sign_up}
            >
              Create a new account
            </Button>
          </div>
        </div>

        {loadingStatus_user === "loading" && (
          <CircularProgress
            size={45}
            sx={{
              position: "absolute",
              top: "40%",
              left: "49%",
              zIndex: 999,
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </main>
    );
  }

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.title_grid}>
          <div className={styles.main_title}>USER SIGN IN</div>
          <div className={styles.sub_title}>
            SIGN IN FOR ACCESS TO YOUR ACCOUNT AND ORDER HISTORY
          </div>
        </div>

        <Grid container className={styles.body_grid}>
          <Grid
            item
            container
            xs={12}
            sm={12}
            md={6}
            className={styles.body_grid_left}
          >
            <div className={styles.body_grid_left_inner}>
              <form onSubmit={singInHandler}>
                {inputFields(inputFieldsArray, inputValues, authErrors, page)}
                <div className={styles.button_group}>
                  <div
                    onClick={forgetPasswordHandler}
                    className={styles.forget_pw}
                  >
                    FORGOT PASSWORD?
                  </div>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    onClick={singInHandler}
                    disabled={pageLoading}
                    loading={pageLoading}
                    className={styles.sign_in_button}
                  >
                    Sign In
                  </LoadingButton>
                </div>
              </form>
            </div>
          </Grid>

          <Grid
            item
            container
            xs={12}
            sm={12}
            md={6}
            className={styles.body_grid_right}
          >
            <div className={styles.body_grid_right_inner}>
              <div className={styles.to_sign_up_text}>
                Creating an account allows you to checkout quickly, keep track
                of your orders and{" "}
                <span style={{ color: "red" }}>FREE SHIPPING</span> for the 1st
                order
              </div>
              <Button
                variant="contained"
                onClick={toSignUpHandler}
                className={styles.to_sign_up}
              >
                Create a new account
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default memo(UserSignIn);
