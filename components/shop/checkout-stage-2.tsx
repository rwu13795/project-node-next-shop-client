import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TokenResult } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { Checkbox, SelectChangeEvent } from "@mui/material";

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
  selectBillingAddress,
  addressFields,
  setBillingAddress,
  toggleBillingAddress,
} from "../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../pages/shop/checkout";
import { TextFieldStyled } from "../../styles/mui-custom-styled-components";
import SelectState from "../auth/select-state";

interface Props {
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
  setStripeCardToken?: Dispatch<SetStateAction<TokenResult | undefined>>;
}

interface StripeCardError {
  type: string;
  code: string;
  message: string;
}

export default function CheckoutStage_2({
  setStage,
  setAllowedStages,
  setStripeCardToken,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  // const authErrors = useSelector(selectAuthErrors);
  const billingAddress = useSelector(selectBillingAddress);
  const elements = useElements();
  const stripe = useStripe();

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [boxChecked, setBoxChecked] = useState<boolean>(true);
  const [cardErorr, setCardError] = useState<StripeCardError>();
  const [cardComplete, setCardComplete] = useState<boolean>(false);

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
    dispatch(setBillingAddress({ name, value }));
    onChangeErrorCheck(name, value, setErrors);
  };

  const stageChangeHandler = async () => {
    let hasError = onSubmitErrorCheck(billingAddress, errors, setErrors);
    if (hasError || cardErorr) return;
    if (!cardComplete) {
      setCardError({
        type: "card_incomplete",
        code: "0000",
        message: "Required field",
      });
      return;
    }
    //////////
    // NOTE //
    // the value inside the cardElement will be destoyed whenever this component is
    // dismounted. I need to create a onc-time-use token using the cardElement,
    // and pass the "token" back the checkout page, where the "confirmCardPayment" takes place
    if (setStripeCardToken && elements && stripe) {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        let token = await stripe.createToken(cardElement);
        setStripeCardToken(token);
      } else {
        console.log("Something went really wrong in Stripe");
      }
    }

    setStage(inputTypes.placeOrder);
    setAllowedStages({ two: true, three: true });
  };

  const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleBillingAddress(!boxChecked));
    setBoxChecked((prev) => !prev);
    setErrors({});
  };

  const renderFields = () => {
    return addressFields.map((inputName) => {
      return inputName !== inputNames.state ? (
        <FormInputField
          key={inputName}
          inputName={inputName}
          inputValue={billingAddress[inputName]}
          onFocus={onFocusHandler}
          onBlur={onBlurHandler}
          onChange={onChangeHandler}
          // authError={authErrors[inputName]}
          inputError={errors[inputName]}
        />
      ) : (
        <div key={inputName}>
          <SelectState
            value={billingAddress[inputName]}
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
        <h3>BILLING ADDRESS</h3>
        <div>
          <Checkbox onChange={checkboxHandler} checked={boxChecked} />
          USE MY SHIPPING ADDRESS FOR BILLING
        </div>
        {renderFields()}
        <div style={{ border: "red 2px solid" }}>
          <TextFieldStyled
            label="CARD"
            variant="outlined"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ position: "relative", bottom: "2rem" }}>
            <CardElement
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            />
            {cardErorr?.message}
          </div>
        </div>
      </div>
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}
