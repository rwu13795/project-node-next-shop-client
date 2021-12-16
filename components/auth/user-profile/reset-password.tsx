import { useState, FocusEvent, ChangeEvent, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { inputNames } from "../../../utils/enums-types/input-names";
import {
  Errors,
  finalCheck,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  Touched,
} from "../../../utils/helper-functions/input-error-check";
import {
  clearAuthErrors,
  resetPassword,
  selectAuthErrors,
  selectLoadingStatus_user,
  setLoadingStatus,
} from "../../../utils/redux-store/userSlice";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import { initializeValues } from "../../../utils/helper-functions/initialize-values";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import { SelectChangeEvent } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./__profile.module.css";

const inputFieldsArray = [
  inputNames.old_password,
  inputNames.new_password,
  inputNames.confirm_new_password,
];

let initialValues = initializeValues(inputFieldsArray);

function ResetPassword({}): JSX.Element {
  const dispatch = useDispatch();
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const authErorrs = useSelector(selectAuthErrors);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [inputValues, setInputValues] = useState<InputValues>(initialValues);

  useEffect(() => {
    dispatch(setPageLoading(false));
    dispatch(setLoadingStatus("idle"));
  }, []);

  useEffect(() => {
    if (
      loadingStatus === "reset_password_succeeded" ||
      loadingStatus === "failed"
    ) {
      dispatch(setPageLoading(false));
      if (loadingStatus === "reset_password_succeeded") {
        setInputValues(initialValues);
      }
    }
  }, [loadingStatus, dispatch]);

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setInputErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    dispatch(clearAuthErrors(name));
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const resetHandler = () => {
    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

    dispatch(setPageLoading(true));
    dispatch(
      resetPassword({
        old_password: inputValues[inputNames.old_password],
        new_password: inputValues[inputNames.new_password],
        confirm_new_password: inputValues[inputNames.confirm_new_password],
      })
    );
  };

  const inputFields = () => {
    return renderInputFields(
      inputFieldsArray,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      authErorrs,
      loadingStatus === "loading" ||
        loadingStatus === "reset_password_succeeded",
      "update-info"
    );
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.main_title}>UPDATE PERSONAL INFO</div>
        <form onSubmit={resetHandler} className={styles.input_fields_container}>
          <div className={styles.input_fields}>{inputFields()} </div>{" "}
          <LoadingButton
            type="submit"
            loading={loadingStatus === "loading"}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
            onClick={resetHandler}
            disabled={
              loadingStatus === "loading" ||
              loadingStatus === "reset_password_succeeded"
            }
            className={styles.update_button}
          >
            Reset
          </LoadingButton>
        </form>

        {loadingStatus === "reset_password_succeeded" && (
          <div className={styles.text_indicator}>
            Password has been reset successfully
          </div>
        )}
      </div>
    </main>
  );
}

export default memo(ResetPassword);
