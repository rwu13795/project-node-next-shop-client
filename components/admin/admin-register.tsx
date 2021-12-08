import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CircularProgress } from "@mui/material";

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
  touched: Touched;
}

export default function AdminRegister({
  inputFieldsArray,
  inputValues,
  inputErrors,
  setInputErrors,
  inputFields,
  touched,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  const adminRegisterHandler = () => {
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
