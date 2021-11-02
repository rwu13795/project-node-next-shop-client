import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress } from "@mui/material";

import {
  Errors,
  InputValues,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import {
  AdminErrors,
  adminRegister,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
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

export default function AdminRegister({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const adminRegisterHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValues,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      adminRegister({
        admin_username: inputValues[inputNames.admin_username],
        password: inputValues[inputNames.password],
        confirm_password: inputValues[inputNames.confirm_password],
      })
    );
  };

  return (
    <div>
      {inputFields(inputFieldsArray, inputValues, adminErrors)}
      <div>
        <button
          onClick={adminRegisterHandler}
          disabled={loadingStatus_admin === "loading"}
        >
          Register
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
