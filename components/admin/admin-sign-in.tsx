import { Dispatch, SetStateAction, FocusEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import {
  Errors,
  InputValues,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import {
  AdminErrors,
  adminSignIn,
  // getAdminStatus,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import { AuthErrors } from "../../utils/redux-store/userSlice";

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

export default function AdminSignIn({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const adminSignInHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;

    dispatch(
      adminSignIn({
        admin_username: inputValues[inputNames.admin_username],
        password: inputValues[inputNames.password],
      })
    );
  };

  return (
    <div>
      {inputFields(inputFieldsArray, inputValues, adminErrors)}
      <div>
        <button
          onClick={adminSignInHandler}
          disabled={loadingStatus_admin === "loading"}
        >
          Sign In
        </button>
        {loadingStatus_admin === "loading" && (
          <CircularProgress
            size={45}
            sx={{
              position: "absolute",
              top: "40%",
              left: "46%",
              // marginTop: "-12px",
              // marginLeft: "-12px",
            }}
          />
        )}
      </div>
    </div>
  );
}
