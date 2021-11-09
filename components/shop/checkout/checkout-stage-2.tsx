import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { TokenResult } from "@stripe/stripe-js";
import {
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import { Checkbox, SelectChangeEvent } from "@mui/material";

import {
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import {
  Touched,
  Errors,
} from "../../../utils/helper-functions/input-error-check";
import { inputTypes } from "../../../utils/enums-types/input-types";
import {
  selectBillingAddress,
  addressFields,
  setBillingAddress,
  toggleBillingAddress,
} from "../../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../../pages/shop/checkout";
import { TextFieldStyled } from "../../../styles/mui-custom-components";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";

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

  const [inputErrors, setInputErrors] = useState<Errors>({});
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
    onBlurErrorCheck(name, value, touched, setInputErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    dispatch(setBillingAddress({ name, value }));
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const stageChangeHandler = async () => {
    let hasError = onSubmitErrorCheck(
      billingAddress,
      inputErrors,
      setInputErrors
    );
    // if (hasError || cardErorr) return;
    // if (!cardComplete) {
    //   setCardError({
    //     type: "card_incomplete",
    //     code: "0000",
    //     message: "Required field",
    //   });
    //   return;
    // }
    //////////
    // NOTE //
    // the value inside the cardElement will be destoyed whenever this component is
    // unmounted. I need to create a onc-time-use token using the cardElement,
    // and pass the "token" back the checkout page, where the "confirmCardPayment" takes place
    if (setStripeCardToken && elements && stripe) {
      const cardElement = elements.getElement(CardNumberElement);
      if (cardElement) {
        let token = await stripe.createToken(cardElement);
        setStripeCardToken(token);
      } else {
        console.log("Something went really wrong in Stripe");
      }
    }

    setStage("3");
    setAllowedStages({ two: true, three: true });
  };

  const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleBillingAddress(!boxChecked));
    setBoxChecked((prev) => !prev);
    setInputErrors({});
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
        <h3>BILLING ADDRESS</h3>
        <div>
          <Checkbox onChange={checkboxHandler} checked={boxChecked} />
          USE MY SHIPPING ADDRESS FOR BILLING
        </div>
        {inputFields(addressFields, billingAddress)}
        <div style={{ border: "red 2px solid" }}>
          Card Number
          <CardNumberElement />
          exp
          <CardExpiryElement />
          ccv
          <CardCvcElement />
        </div>
      </div>
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}

// NOTE //
/* In case you are using the CardNumberElement, CardExpiryElement, CardCvcElement, 
   just use "elements.getElement(CardNumberElement)" to grab the "CardNumberElement"
   the "elements.getElement" will automatically grab the Exp and CCV data
   the rest is the same as using <CardElement />
*/

/*{/* <TextFieldStyled
            label="CARD"
            variant="outlined"
            disabled={true}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <div style={{ position: "relative", bottom: "2rem" }}>
            {/* <CardElement
              onChange={(e) => {
                setCardError(e.error);
                setCardComplete(e.complete);
              }}
            /> */
/* Card Number
            <CardNumberElement />
            exp
            <CardExpiryElement />
            ccv
            <CardCvcElement />
            {cardErorr?.message}  */
