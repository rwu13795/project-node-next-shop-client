import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { SelectChangeEvent } from "@mui/material";

import {
  InputValue,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../utils/react-hooks/input-error-check";
import { inputNames } from "../../utils/enums-types/input-names";
import { Touched, Errors } from "../../utils/react-hooks/input-error-check";
import FormInputField from "../auth/form-input-field";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectShippingAddress,
  selectContactInfo,
  addressFields,
  contactFields,
  setShippingAddress,
  setContactInfo,
} from "../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../pages/shop/checkout";

import SelectState from "../auth/select-state";

interface Props {
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
}

export default function CheckoutStage_1({
  setStage,
  setAllowedStages,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const contactInfo = useSelector(selectContactInfo);

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [boxChecked, setBoxChecked] = useState<boolean>(true);

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
    if (name === inputNames.email || name === inputNames.phone) {
      dispatch(setContactInfo({ name, value }));
    } else {
      dispatch(setShippingAddress({ name, value }));
    }
    onChangeErrorCheck(name, value, setErrors);
  };

  const stageChangeHandler = async () => {
    let hasError = false;
    hasError = onSubmitErrorCheck(shippingAddress, errors, setErrors);
    if (hasError) return;
    hasError = onSubmitErrorCheck(contactInfo, errors, setErrors);
    if (hasError) return;

    setStage(inputTypes.paymentInfo);
    setAllowedStages({ two: true, three: false });
  };

  const renderFields = (fieldsArray: string[], inputValue: InputValue) => {
    return fieldsArray.map((inputName) => {
      return inputName !== inputNames.state ? (
        <FormInputField
          key={inputName}
          inputName={inputName}
          inputValue={inputValue[inputName]}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          // authError={authErrors[inputName]}
          inputError={errors[inputName]}
        />
      ) : (
        <div key={inputName}>
          <SelectState
            value={inputValue[inputName]}
            inputName={inputName}
            onFocusHandler={onFocusHandler}
            onBlurHandler={onBlurHandler}
            onChangeHandler={onChangeHandler}
          />
          {errors[inputName]}
        </div>
      );
    });
  };

  return (
    <main>
      <div>
        <h3>SHIPPING ADDRESS</h3>
        {renderFields(addressFields, shippingAddress)}
        <h3>CONTACT INFO</h3>
        {renderFields(contactFields, contactInfo)}
      </div>
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}
