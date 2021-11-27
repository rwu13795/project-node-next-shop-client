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
  onSubmitErrorCheck,
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
import styles from "./__user-sign-in.module.css";

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
  signInModal,
  page,
  modalHandleClose,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);
  const pageLoading = useSelector(selectPageLoading);

  const [forgotPassword, setForgetPassword] = useState<boolean>(false);

  useEffect(() => {
    dispatch(clearAuthErrors("all"));
  }, [dispatch]);

  useEffect(() => {
    if (loadingStatus_user === "failed") {
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus_user, dispatch]);

  const singInHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(setPageLoading(true));
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
    setForgetPassword(true);
  };

  const requestSubmitHandler = () => {
    dispatch(forgotPassword_Request(inputValues[inputNames.email]));
  };

  if (signInModal) {
    return <main>123</main>;
  }

  return (
    <main className={styles.main_container}>
      {!forgotPassword ? (
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
              <form onSubmit={singInHandler}>
                {inputFields(inputFieldsArray, inputValues, authErrors, page)}
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
                    disabled={pageLoading}
                    className={styles.sign_in_button}
                  >
                    Sign In
                  </Button>
                </div>
              </form>
            </Grid>

            <Grid
              item
              container
              xs={12}
              sm={12}
              md={6}
              className={styles.body_grid_right}
            >
              <Link href="/auth/sign-up">
                <a onClick={modalHandleClose}>Create a new account</a>
              </Link>
            </Grid>
          </Grid>
        </div>
      ) : (
        <div>
          <h3>RESET PASSWORD</h3>
          <div>1. ENTER THE EMAIL ADDRESS CONNECTED TO YOUR ACCOUNT</div>
          <div>2. CHECK YOUR INBOX FOR A MESSAGE FROM US.</div>
          <div>3. FOLLOW THE LINK TO RESET YOUR PASSWORD.</div>
          <hr />
          {loadingStatus_user === loadingStatus.succeeded && (
            <div>
              A link for resetting the password has been sent to your email
            </div>
          )}
          <div>{inputFields([inputNames.email], inputValues, authErrors)}</div>
          <div>
            <button
              onClick={requestSubmitHandler}
              disabled={loadingStatus_user === loadingStatus.succeeded}
            >
              SUBMIT
            </button>
            <button onClick={() => setForgetPassword(false)}>
              Back to Sign In
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default memo(UserSignIn);

/*
{loadingStatus_user === "loading" && (
            <CircularProgress
              size={45}
              sx={{
                position: "absolute",
                top: "40%",
                left: "46%",
                zIndex: 999,
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}


*/
