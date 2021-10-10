import { Dispatch, SetStateAction, FocusEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import {
  Errors,
  InputValue,
  onSubmitErrorCheck,
} from "../../utils/helper-functions/input-error-check";
import {
  AdminErrors,
  adminRegister,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import renderInputFields from "../../utils/helper-functions/render-input-fields";
import { AuthErrors } from "../../utils/redux-store/userSlice";

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

export default function AdminRegister({
  inputFieldsArray,
  inputValue,
  inputErrors,
  setInputErrors,
  inputFields,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const adminRegisterHandler = () => {
    const hasError = onSubmitErrorCheck(
      inputValue,
      inputErrors,
      setInputErrors
    );
    if (hasError) return;
    dispatch(
      adminRegister({
        admin_username: inputValue[inputNames.admin_username],
        password: inputValue[inputNames.password],
        confirm_password: inputValue[inputNames.confirm_password],
      })
    );
  };

  return (
    <div>
      {inputFields(inputFieldsArray, inputValue, adminErrors)}
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
