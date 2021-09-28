import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
} from "react";
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
import FormInputField from "../auth/form-input-field";

import { inputTypes } from "../../utils/enums-types/input-types";
import { CircularProgress } from "@mui/material";
import {
  selectAddressInfo,
  setAddressInfo,
} from "../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../pages/shop/checkout";

interface Props {
  stage: string;
  addressFields: string[];
  paymentFields?: string[];
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
}

export default function CheckoutForm({
  stage,
  addressFields,
  paymentFields,
  setStage,
  setAllowedStages,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  // const authErrors = useSelector(selectAuthErrors);
  const loadingStatus = useSelector(selectLoadingStatus);
  const addressInfo = useSelector(selectAddressInfo);

  const [addressFieldsArray] = useState<string[]>(addressFields);
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    // dispatch(clearAuthErrors(name));
    dispatch(setAddressInfo({ name, value }));
    onChangeErrorCheck(name, value, setErrors);
  };

  const stageChangeHandler = () => {
    const hasError = onSubmitErrorCheck(addressInfo, errors, setErrors);
    if (hasError) return;

    if (stage === inputTypes.addressInfo) {
      setStage(inputTypes.paymentInfo);
      setAllowedStages({ two: true, three: false });
    } else {
      setStage(inputTypes.placeOrder);
      setAllowedStages({ two: true, three: true });
    }
  };

  const renderAddressFields = () => {
    return addressFieldsArray.map((inputName) => {
      return (
        <FormInputField
          key={inputName}
          inputName={inputName}
          inputValue={addressInfo[inputName]}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          // authError={authErrors[inputName]}
          inputError={errors[inputName]}
        />
      );
    });
  };

  return (
    <main>
      <h3>
        {stage === inputTypes.addressInfo
          ? "SHIPPING ADDRESS"
          : "BILLING ADDRESS"}
      </h3>
      {stage === inputTypes.paymentInfo && (
        <div>USE MY SHIPPING ADDRESS FOR BILLING </div>
      )}
      {renderAddressFields()}
      {stage === inputTypes.paymentInfo && <h4>Payment info</h4>}
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}
