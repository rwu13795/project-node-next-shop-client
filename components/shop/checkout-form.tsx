import React, { useState, ChangeEvent, FocusEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../utils/react-hooks/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import { Touched, Errors } from "../../utils/react-hooks/input-error-check";
import {
  clearAuthErrors,
  selectAuthErrors,
  selectLoadingStatus,
} from "../../utils/redux-store/userSlice";
import FormInputField from "../auth/input-field";

import { inputTypes } from "../../utils/enums-types/input-types";
import { CircularProgress } from "@mui/material";

interface Props {
  inputType: string;
  inputFields: string[];
  addressInfo?: Object;
}

export default function CheckoutForm({
  inputType,
  inputFields,
  addressInfo,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const authErrors = useSelector(selectAuthErrors);
  const loadingStatus = useSelector(selectLoadingStatus);

  const [inputFieldsArray] = useState<string[]>(inputFields);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const [inputValue, setInputValue] = useState<InputValue>(() => {
    let initialValue: InputValue = {};
    for (let name of inputFields) {
      initialValue = { ...initialValue, [name]: "" };
    }
    return initialValue;
  });

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setErrors);
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    dispatch(clearAuthErrors(name));
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setErrors);
  };

  const renderFields = () => {
    return inputFieldsArray.map((inputName) => {
      return (
        <FormInputField
          key={inputName}
          inputName={inputName}
          inputValue={inputValue[inputName]}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          authError={authErrors[inputName]}
          inputError={errors[inputName]}
        />
      );
    });
  };

  return <main>{renderFields()}</main>;
}
