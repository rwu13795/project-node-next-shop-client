import { Dispatch, SetStateAction, FormEvent, MouseEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Errors,
  finalCheck,
  InputValues,
  onSubmitErrorCheck,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import {
  AdminErrors,
  adminRegister,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { AuthErrors } from "../../utils/redux-store/userSlice";

// UI //
import { Button, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import styles from "./__admin-sign-in-up.module.css";

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

export default function AdminRegister({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
  touched,
  page,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const adminRegisterHandler = (
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
      adminRegister({
        admin_username: inputValues[inputNames.admin_username],
        password: inputValues[inputNames.password],
        confirm_password: inputValues[inputNames.confirm_password],
      })
    );
  };

  return (
    <form onSubmit={adminRegisterHandler}>
      {inputFields(inputFieldsArray, inputValues, adminErrors, page)}
      <LoadingButton
        type="submit"
        variant="contained"
        onClick={adminRegisterHandler}
        disabled={loadingStatus_admin === "loading"}
        loading={loadingStatus_admin === "loading"}
        className={styles.button_box}
      >
        Register
      </LoadingButton>
    </form>
  );
}
