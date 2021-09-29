import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Checkbox, TextField } from "@mui/material";

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
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import {
  selectBillingAddress,
  selectShippingAddress,
  selectContactInfo,
  addressFields,
  contactFields,
  setShippingAddress,
  setBillingAddress,
  setContactInfo,
  clearBillingAddress,
} from "../../utils/redux-store/checkoutSlice";
import { AllowedStages } from "../../pages/shop/checkout";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { TextFieldStyled } from "../../styles/mui-custom-styled-components";
import { StripeCardElement, TokenResult } from "@stripe/stripe-js";

interface Props {
  stage: string;
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
  setStripeCardToken?: Dispatch<SetStateAction<TokenResult | undefined>>;
}

interface StripeCardError {
  type: string;
  code: string;
  message: string;
}

const stateArray = ["NEW YORK", "NEW JESSERY"];

export default function CheckoutForm({
  stage,
  setStage,
  setAllowedStages,
  setStripeCardToken,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  // const authErrors = useSelector(selectAuthErrors);
  const loadingStatus = useSelector(selectLoadingStatus);
  const shippingAddress = useSelector(selectShippingAddress);
  const billingAddress = useSelector(selectBillingAddress);
  const contactInfo = useSelector(selectContactInfo);
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

    console.log(name, value);
    if (stage === inputTypes.addressInfo) {
      if (name === inputNames.email || name === inputNames.phone) {
        dispatch(setContactInfo({ name, value }));
      } else {
        dispatch(setShippingAddress({ name, value }));
      }
    } else {
      dispatch(setBillingAddress({ name, value }));
    }
    // dispatch(clearAuthErrors(name));

    onChangeErrorCheck(name, value, setErrors);
  };

  const stageChangeHandler = async () => {
    console.log("wtf");
    let hasError = false;
    if (stage === inputTypes.addressInfo) {
      hasError = onSubmitErrorCheck(shippingAddress, errors, setErrors);
      if (hasError) return;
      hasError = onSubmitErrorCheck(contactInfo, errors, setErrors);
      if (hasError) return;
      setStage(inputTypes.paymentInfo);
      setAllowedStages({ two: true, three: false });
    } else {
      hasError = onSubmitErrorCheck(billingAddress, errors, setErrors);
      if (hasError || cardErorr) return;
      if (!cardComplete) {
        setCardError({
          type: "card_incomplete",
          code: "000",
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
          console.log("token", token);
          setStripeCardToken(token);
        } else {
          console.log("no fucking cardElement");
        }
      }

      setStage(inputTypes.placeOrder);
      setAllowedStages({ two: true, three: true });
    }
  };

  const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(clearBillingAddress(!boxChecked));
    setBoxChecked((prev) => !prev);
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
        <FormControl
          key={inputName}
          variant="standard"
          sx={{ m: 0, minWidth: 120, boxShadow: 0 }}
        >
          <InputLabel style={{ fontSize: "1rem" }}>STATE</InputLabel>
          <Select
            value={inputValue[inputName]}
            name={inputName}
            label="STATE"
            sx={{ m: 0, minWidth: 130 }}
            onFocus={onFocusHandler}
            onBlur={onBlurHandler}
            onChange={onChangeHandler}
          >
            {stateArray.map((state) => {
              return (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              );
            })}
          </Select>
          {errors[inputName]}
        </FormControl>
      );
    });
  };

  let content;
  if (stage === inputTypes.addressInfo) {
    content = (
      <div>
        <h3>SHIPPING ADDRESS</h3>
        {renderFields(addressFields, shippingAddress)}
        <h3>CONTACT INFO</h3>
        {renderFields(contactFields, contactInfo)}
      </div>
    );
  } else {
    content = (
      <div>
        <h3>BILLING ADDRESS</h3>
        <div>
          <Checkbox onChange={checkboxHandler} checked={boxChecked} />
          USE MY SHIPPING ADDRESS FOR BILLING
        </div>
        {renderFields(addressFields, billingAddress)}
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
    );
  }

  return (
    <main>
      {content}
      <div>
        <button onClick={stageChangeHandler}>CONTINUE</button>
      </div>
    </main>
  );
}
