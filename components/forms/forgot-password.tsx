import {
  Dispatch,
  SetStateAction,
  useEffect,
  memo,
  MouseEvent,
  FormEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  Errors,
  finalCheck,
  InputValues,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import {
  AuthErrors,
  clearAuthErrors,
  forgotPassword_Request,
  selectAuthErrors,
  selectLoadingStatus_user,
  setLoadingStatus,
} from "../../utils/redux-store/userSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { loadingStatus } from "../../utils/enums-types/loading-status";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { Button, useMediaQuery } from "@mui/material";
import styles from "./__user-sign-in.module.css";
import { sxMUI } from "./__user-sign-in-MUI";

interface Props {
  inputFieldsArray: string[];
  inputValues: InputValues;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValues: InputValues,
    requestError: AuthErrors | AdminErrors,
    page?: string
  ) => JSX.Element[];
  touched: Touched;
}

function UserForgotPassword({
  inputValues,
  setInputErrors,
  inputFields,
  touched,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const isSmall = useMediaQuery("(max-width: 765px)");

  useEffect(() => {
    dispatch(clearAuthErrors("all"));
  }, [dispatch]);

  useEffect(() => {
    if (loadingStatus_user === "failed") {
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus_user, dispatch]);

  const requestSubmitHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    dispatch(forgotPassword_Request(inputValues[inputNames.email]));
  };

  const backToSignInHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(setLoadingStatus("idle"));
    router.push("/auth/sign-in");
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.forgot_pw_main_grid}>
        <div className={styles.title_grid}>
          <div className={styles.main_title}>RESET PASSWORD</div>
          <div className={styles.sub_title}>
            1. ENTER THE EMAIL ADDRESS CONNECTED TO YOUR ACCOUNT
          </div>
          <div className={styles.sub_title}>
            2. CHECK YOUR INBOX FOR A MESSAGE FROM US.
          </div>
          <div className={styles.sub_title}>
            3. FOLLOW THE LINK TO RESET YOUR PASSWORD.
          </div>
        </div>

        <div className={styles.reset_pw_container}>
          <form onSubmit={requestSubmitHandler}>
            <div>
              {inputFields([inputNames.email], inputValues, authErrors)}
            </div>

            <Button
              type="submit"
              variant="contained"
              onClick={requestSubmitHandler}
              disabled={loadingStatus_user === loadingStatus.succeeded}
              sx={isSmall ? sxMUI.reset_button_small : sxMUI.reset_button}
            >
              SUBMIT
            </Button>
          </form>
          {loadingStatus_user === loadingStatus.succeeded && (
            <div className={styles.reset_text}>
              A link for resetting the password has been sent to the email you
              provided
            </div>
          )}
        </div>

        <hr />
        <div className={styles.to_sign_in}>
          <Button
            variant="outlined"
            onClick={backToSignInHandler}
            sx={isSmall ? sxMUI.reset_button_small : sxMUI.reset_button}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </main>
  );
}

export default memo(UserForgotPassword);
