import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  useEffect,
  memo,
  FormEvent,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  finalCheck,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import { inputNames } from "../../../utils/enums-types/input-names";
import {
  Touched,
  Errors,
} from "../../../utils/helper-functions/input-error-check";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import {
  clearAuthErrors,
  selectAuthErrors,
  selectCurrentUser,
  selectLoadingStatus_user,
  setLoadingStatus,
  updateUserInfo,
} from "../../../utils/redux-store/userSlice";
import { initializeValues } from "../../../utils/helper-functions/initialize-values";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //

import { SelectChangeEvent } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__profile.module.css";

const inputFieldsArray = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.city,
  inputNames.state,
  inputNames.zip_code,
  inputNames.phone,
];

let initialValues = initializeValues(inputFieldsArray);

function UpdateProfile({}): JSX.Element {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const authErrors = useSelector(selectAuthErrors);

  const [inputValues, setInputValues] = useState<InputValues>(initialValues);
  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  useEffect(() => {
    dispatch(setPageLoading(false));
    dispatch(setLoadingStatus("idle"));
  }, []);

  useEffect(() => {
    if (currentUser && currentUser.userInfo) {
      setInputValues({
        [inputNames.first_name]: currentUser.userInfo.first_name,
        [inputNames.last_name]: currentUser.userInfo.last_name,
        [inputNames.address_1]: currentUser.userInfo.address_1,
        [inputNames.address_2]: currentUser.userInfo.address_2,
        [inputNames.city]: currentUser.userInfo.city,
        [inputNames.state]: currentUser.userInfo.state,
        [inputNames.zip_code]: currentUser.userInfo.zip_code,
        [inputNames.phone]: currentUser.userInfo.phone,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (loadingStatus === "idle" || loadingStatus === "succeeded") {
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus, dispatch]);

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    if (name === inputNames.address_2) return;

    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    if (name === inputNames.address_2) return;

    onBlurErrorCheck(name, value, touched, setInputErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    dispatch(clearAuthErrors("no_change"));
    setInputValues((prev) => {
      return { ...prev, [name]: value };
    });

    if (name === inputNames.address_2) return;
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const updateHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    dispatch(setPageLoading(true));
    dispatch(updateUserInfo({ inputValues }));
  };

  const inputFields = (fields: string[], inputValues: InputValues) => {
    return renderInputFields(
      fields,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      undefined,
      undefined,
      "update-info"
    );
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.main_grid}>
        <div className={styles.main_title}>UPDATE PERSONAL INFO</div>

        <form
          onSubmit={updateHandler}
          className={styles.input_fields_container}
        >
          <div className={styles.input_fields}>
            {inputFields(inputFieldsArray, inputValues)}
          </div>
          <LoadingButton
            type="submit"
            variant="outlined"
            loading={loadingStatus === "loading"}
            loadingPosition="start"
            startIcon={<SaveIcon />}
            disabled={loadingStatus === "loading"}
            onClick={updateHandler}
            className={styles.update_button}
          >
            UPDATE
          </LoadingButton>
        </form>

        <div className={styles.update_error}>
          {authErrors["no_change"] && authErrors["no_change"]}
        </div>
      </div>
    </main>
  );
}

export default memo(UpdateProfile);
