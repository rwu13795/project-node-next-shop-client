import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { SelectChangeEvent } from "@mui/material";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import { inputNames } from "../../../utils/enums-types/input-names";
import {
  Touched,
  Errors,
} from "../../../utils/helper-functions/input-error-check";
import { inputTypes } from "../../../utils/enums-types/input-types";
import {
  selectShippingAddress,
  selectContactInfo,
  addressFields,
  contactFields,
  setShippingAddress,
  setContactInfo,
  loadUserInfo,
} from "../../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../../pages/shop/checkout";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import {
  clearAuthErrors,
  selectAuthErrors,
  selectCsrfToken,
  selectCurrentUser,
  selectLoadingStatus_user,
  updateUserInfo,
} from "../../../utils/redux-store/userSlice";

interface Props {}

const fieldsArray = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.city,
  inputNames.state,
  inputNames.zip_code,
  inputNames.phone,
];

export default function UpdateProfile({}): JSX.Element {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const loadingStatus = useSelector(selectLoadingStatus_user);
  const authErrors = useSelector(selectAuthErrors);

  const [inputValue, setInputValue] = useState<InputValue>(() => {
    if (currentUser && currentUser.userInfo) {
      return {
        [inputNames.first_name]: currentUser.userInfo.first_name,
        [inputNames.last_name]: currentUser.userInfo.last_name,
        [inputNames.address_1]: currentUser.userInfo.address_1,
        [inputNames.address_2]: currentUser.userInfo.address_2,
        [inputNames.city]: currentUser.userInfo.city,
        [inputNames.state]: currentUser.userInfo.state,
        [inputNames.zip_code]: currentUser.userInfo.zip_code,
        [inputNames.phone]: currentUser.userInfo.phone,
      } as InputValue;
    }

    return {};
  });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    dispatch(clearAuthErrors("no_change"));
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setErrors);
  };

  const updateHandler = () => {
    const hasError = onSubmitErrorCheck(inputValue, errors, setErrors);
    if (hasError) return;
    dispatch(updateUserInfo({ inputValue }));
  };

  const inputFields = (fields: string[], inputValue: InputValue) => {
    return renderInputFields(
      fields,
      inputValue,
      errors,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler
    );
  };

  return (
    <main>
      <div>
        <h3>UPDATE PERSONAL INFO</h3>
        {inputFields(fieldsArray, inputValue)}
      </div>
      <div>
        <button onClick={updateHandler}>UPDATE</button>
      </div>
      {loadingStatus === "loading" && <div>Updating </div>}
      {authErrors["no_change"] && authErrors["no_change"]}
    </main>
  );
}
