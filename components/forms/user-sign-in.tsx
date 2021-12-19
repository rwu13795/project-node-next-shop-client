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
import { useRouter } from "next/router";

import {
  Errors,
  finalCheck,
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
  setPageLoading_user,
  signIn,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { loadingStatus } from "../../utils/enums-types/loading-status";
import {
  selectPageLoading,
  setPageLoading,
} from "../../utils/redux-store/layoutSlice";

// UI //
import { Button, CircularProgress, Grid, useMediaQuery } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./__user-sign-in.module.css";
import { sxMUI } from "./__user-sign-in-MUI";

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
  const pageLoading_user = useSelector(selectPageLoading_user);

  const isSmall = useMediaQuery("(max-width: 765px)");

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

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    if (!signInModal) {
      dispatch(setPageLoading_user(true));
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
    // since the signIn button loading animation is depending on "pageLoading"
    // I have to use the other "pageLoading_user" to trigger the loading bar
    dispatch(setPageLoading(true));
    router.push("/auth/forgot-password");
  };

  const toSignUpHandler = () => {
    if (modalHandleClose) modalHandleClose();
    dispatch(setPageLoading(true));
    router.push("/auth/sign-up");
  };

  const checkoutAsGuestHandler = () => {
    dispatch(setPageLoading(true));
    router.push("/shop/checkout");
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
                <Link href="/auth/forgot-password">
                  <a
                    onClick={forgetPasswordHandler}
                    className={styles.forget_pw}
                  >
                    FORGOT PASSWORD?
                  </a>
                </Link>
                <Button
                  sx={
                    isSmall ? sxMUI.sign_in_button_small : sxMUI.sign_in_button
                  }
                  type="submit"
                  variant="contained"
                  onClick={singInHandler}
                  disabled={loadingStatus_user === "loading"}
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
              sx={isSmall ? sxMUI.to_sign_up_small : sxMUI.to_sign_up}
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
          <div className={styles.main_title}>
            {page === "checkout-sign-in"
              ? "RETURNING CUSTOMER "
              : "USER SIGN IN"}
          </div>
          <div className={styles.sub_title}>
            {page === "checkout-sign-in"
              ? "IF YOU HAVE AN ACCOUNT, SIGN IN TO CHECKOUT FASTER"
              : "SIGN IN FOR ACCESS TO YOUR ACCOUNT AND ORDER HISTORY"}
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
                  <Link href="/auth/forgot-password">
                    <a
                      onClick={forgetPasswordHandler}
                      className={styles.forget_pw}
                    >
                      FORGOT PASSWORD?
                    </a>
                  </Link>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    onClick={singInHandler}
                    disabled={pageLoading}
                    loading={pageLoading_user}
                    sx={
                      isSmall
                        ? sxMUI.sign_in_button_small
                        : sxMUI.sign_in_button
                    }
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
              {page === "checkout-sign-in" ? (
                <div className={styles.to_sign_up_text}>
                  If you don&apos;t have an account, you can continue to
                  checkout as a guest
                </div>
              ) : (
                <div className={styles.to_sign_up_text}>
                  Creating an account allows you to checkout quickly, keep track
                  of your orders and{" "}
                  <span style={{ color: "red" }}>FREE SHIPPING</span> for the
                  1st order
                </div>
              )}
              {page === "checkout-sign-in" ? (
                <Button
                  variant="contained"
                  onClick={checkoutAsGuestHandler}
                  sx={isSmall ? sxMUI.to_sign_up_small : sxMUI.to_sign_up}
                >
                  CHECKOUT AS GUEST
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={toSignUpHandler}
                  sx={isSmall ? sxMUI.to_sign_up_small : sxMUI.to_sign_up}
                >
                  Create a new account
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

export default memo(UserSignIn);
