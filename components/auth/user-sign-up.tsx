import {
  Dispatch,
  SetStateAction,
  useState,
  FocusEvent,
  ChangeEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import {
  Errors,
  InputValue,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import Redirect_signedUp_to_homePage from "./redirect-signed-up";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import {
  AuthErrors,
  selectAuthErrors,
  selectLoadingStatus_user,
  signUp,
} from "../../utils/redux-store/userSlice";

interface Props {
  inputFieldsArray: string[];
  inputValue: InputValue;
  inputErrors: Errors;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValue: InputValue,
    requestError: AuthErrors | AdminErrors
  ) => JSX.Element[];
}

export default function UserSignUp({
  inputFieldsArray,
  inputValue,
  inputErrors,
  setInputErrors,
  inputFields,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const singUpHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValue,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      signUp({
        email: inputValue[inputNames.email],
        password: inputValue[inputNames.password],
        confirm_password: inputValue[inputNames.confirm_password],
        userInfo: {
          first_name: inputValue[inputNames.first_name],
          last_name: inputValue[inputNames.last_name],
          phone: inputValue[inputNames.phone],
          address_1: inputValue[inputNames.address_1],
          address_2: inputValue[inputNames.address_2],
          city: inputValue[inputNames.city],
          state: inputValue[inputNames.state],
          zip_code: inputValue[inputNames.zip_code],
        },
      })
    );
  };

  return loadingStatus_user !== "succeeded" ? (
    <div>
      <Link href="/auth/sign-in">
        <a>
          <Button variant="contained">Sign In</Button>
        </a>
      </Link>
      <span> Have a existing account?</span>
      <hr />
      {inputFields(inputFieldsArray, inputValue, authErrors)}
      <div>
        <Button
          variant="contained"
          onClick={singUpHandler}
          disabled={loadingStatus_user !== "idle"}
        >
          CREATE ACCOUNT
        </Button>
      </div>
      {loadingStatus_user === "loading" && <CircularProgress />}
    </div>
  ) : (
    <Redirect_signedUp_to_homePage />
  );
}
