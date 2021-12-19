import {
  Dispatch,
  SetStateAction,
  FormEvent,
  MouseEvent,
  useEffect,
  memo,
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
import { inputNames } from "../../utils/enums-types/input-names";
import Redirect_signedUp_to_homePage from "../auth/redirect-signed-up";
import {
  AuthErrors,
  selectAuthErrors,
  selectLoadingStatus_user,
  setLoadingStatus,
  setPageLoading_user,
  signUp,
} from "../../utils/redux-store/userSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { Button, useMediaQuery } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./__user-sign-up.module.css";

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
  page?: string;
}

function UserSignUp({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
  touched,
  page,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const isSmall = useMediaQuery("(max-width: 765px)");

  useEffect(() => {
    dispatch(setLoadingStatus("idle"));
  }, []);

  const singUpHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    dispatch(setPageLoading_user(true));

    dispatch(
      signUp({
        email: inputValues[inputNames.email],
        password: inputValues[inputNames.password],
        confirm_password: inputValues[inputNames.confirm_password],
        userInfo: {
          first_name: inputValues[inputNames.first_name],
          last_name: inputValues[inputNames.last_name],
          phone: inputValues[inputNames.phone],
          address_1: inputValues[inputNames.address_1],
          address_2: inputValues[inputNames.address_2],
          city: inputValues[inputNames.city],
          state: inputValues[inputNames.state],
          zip_code: inputValues[inputNames.zip_code],
        },
      })
    );
  };

  const onSignInClickHandler = () => {
    dispatch(setPageLoading(true));
    router.push("/auth/sign-in");
  };

  return (
    <main className={styles.main_container}>
      {loadingStatus_user !== "succeeded" ? (
        <div className={styles.main_grid}>
          <div className={styles.title_grid}>
            <div className={styles.main_title}>NEW USER SIGN UP</div>
            <div className={styles.sub_title}>
              CREATING AN ACCOUNT ALLOWS YOU TO CHECKOUT QUICKLY AND KEEP TRACK
              OF YOUR ORDERS
            </div>
          </div>
          <div className={styles.sign_in_box}>
            <div> Do you have an existing account?</div>
            <Button
              variant="contained"
              sx={{ width: "180px", mt: "10px" }}
              onClick={onSignInClickHandler}
            >
              Sign In
            </Button>
          </div>

          <hr />
          <form onSubmit={singUpHandler}>
            <div className={styles.input_fields_container}>
              <div className={styles.input_fields_grid}>
                <div className={styles.input_title}>
                  ENTER YOUR INFORMATION BELOW
                </div>
                {inputFields(inputFieldsArray, inputValues, authErrors, page)}
              </div>
              <div className={styles.create_button_container}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  onClick={singUpHandler}
                  disabled={loadingStatus_user !== "idle"}
                  loading={loadingStatus_user === "loading"}
                  sx={{ width: isSmall ? "70vw" : "300px", mt: "20px" }}
                >
                  CREATE ACCOUNT
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <Redirect_signedUp_to_homePage />
      )}
    </main>
  );
}

export default memo(UserSignUp);
