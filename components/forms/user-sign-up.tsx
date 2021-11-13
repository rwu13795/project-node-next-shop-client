import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import { Button, CircularProgress } from "@mui/material";

import {
  Errors,
  InputValues,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import { AdminErrors } from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import Redirect_signedUp_to_homePage from "../auth/redirect-signed-up";
import {
  AuthErrors,
  selectAuthErrors,
  selectLoadingStatus_user,
  signUp,
} from "../../utils/redux-store/userSlice";

interface Props {
  inputFieldsArray: string[];
  inputValues: InputValues;
  inputErrors: Errors;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValues: InputValues,
    requestError: AuthErrors | AdminErrors
  ) => JSX.Element[];
}

export default function UserSignUp({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus_user = useSelector(selectLoadingStatus_user);

  const singUpHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
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

  return loadingStatus_user !== "succeeded" ? (
    <div>
      <Link href="/auth/sign-in">
        <a>
          <Button variant="contained">Sign In</Button>
        </a>
      </Link>
      <span> Have a existing account?</span>
      <hr />
      {inputFields(inputFieldsArray, inputValues, authErrors)}
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
