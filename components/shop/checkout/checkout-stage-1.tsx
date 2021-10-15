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
  InputValues,
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
import {
  selectShippingAddress,
  selectContactInfo,
  addressFields,
  contactFields,
  setShippingAddress,
  setContactInfo,
} from "../../../utils/redux-store/checkoutSlice";

import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import { AllowedStages } from "../../../pages/shop/checkout";
import { inputTypes } from "../../../utils/enums-types/input-types";
import {
  removeFromCartSession,
  selectCart,
} from "../../../utils/redux-store/userSlice";

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
  const cart = useSelector(selectCart);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

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
    if (name === inputNames.email || name === inputNames.phone) {
      dispatch(setContactInfo({ name, value }));
    } else {
      dispatch(setShippingAddress({ name, value }));
    }
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const stageChangeHandler = async () => {
    let hasError = false;
    hasError = onSubmitErrorCheck(shippingAddress, inputErrors, setInputErrors);
    if (hasError) return;
    hasError = onSubmitErrorCheck(contactInfo, inputErrors, setInputErrors);
    if (hasError) return;

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity === 0) {
        dispatch(removeFromCartSession(i));
      }
    }
    setStage("2");
    setAllowedStages({ two: true, three: false });
  };

  const inputFields = (fields: string[], inputValues: InputValues) => {
    return renderInputFields(
      fields,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors
    );
  };

  return (
    <main>
      <div>
        <h3>SHIPPING ADDRESS</h3>
        {inputFields(addressFields, shippingAddress)}
        <h3>CONTACT INFO</h3>
        {inputFields(contactFields, contactInfo)}
      </div>
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}
