import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
  memo,
  FormEvent,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StripeCardCvcElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardNumberElementChangeEvent,
  TokenResult,
} from "@stripe/stripe-js";
import {
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Image from "next/image";

import {
  cardCompleteCheck,
  cardErorrsCheck,
  finalCheck,
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
} from "../../../utils/redux-store/shopSlice";
import { AllowedStages } from "../../../pages/shop/checkout";
import { TextFieldStyled } from "../../../styles/mui-custom-components";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import { selectCart } from "../../../utils/redux-store/userSlice";
import CartDetail from "../cart/cart-detail";

// UI //
import {
  Button,
  Checkbox,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import styles from "./__stage.module.css";
import StripeCardElement from "./stripe-card-elements";

interface Props {
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
  setStripeCardToken?: Dispatch<SetStateAction<TokenResult | undefined>>;
}

interface StripeElementError {
  type: "validation_error";
  code: string;
  message: string;
}
export interface CardErrors {
  cardNumber: StripeElementError | undefined;
  cardExpiry: StripeElementError | undefined;
  cardCvc: StripeElementError | undefined;
  [elem: string]: StripeElementError | undefined;
}
export interface CardComplete {
  cardNumber: boolean;
  cardExpiry: boolean;
  cardCvc: boolean;
  [elem: string]: boolean;
}
export interface IncompleteError {
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  [elem: string]: string;
}

function CheckoutStage_2({
  setStage,
  setAllowedStages,
  setStripeCardToken,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  // const authErrors = useSelector(selectAuthErrors);
  const billingAddress = useSelector(selectBillingAddress);
  const elements = useElements();
  const stripe = useStripe();
  const cart = useSelector(selectCart);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [boxChecked, setBoxChecked] = useState<boolean>(true);
  const [cardErorrs, setCardErrors] = useState<CardErrors>({
    cardNumber: undefined,
    cardExpiry: undefined,
    cardCvc: undefined,
  });
  const [cardComplete, setCardComplete] = useState<CardComplete>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });
  const [incompleteError, setIncompleteError] = useState<IncompleteError>({
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  });

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

  const stageChangeHandler = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const errorInput = finalCheck(billingAddress, touched, setInputErrors);
    if (errorInput !== "") {
      const elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

    const cardErrorField = cardErorrsCheck(cardErorrs);
    if (cardErrorField !== "") {
      const elem = document.getElementById(cardErrorField);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

    // if user hit "Enter" to submit after filling out the last element
    // the stripeCard error check won't be triggered since it is triggered onBlur
    // so I have to use the stripe cardComplete status to check the input in such
    // circumstance and display an incomplete error
    const incompleteCardField = cardCompleteCheck(cardComplete, cardErorrs);
    if (incompleteCardField !== "") {
      setIncompleteError((prev) => {
        return { ...prev, [incompleteCardField]: "Incomplete field" };
      });
      const elem = document.getElementById(incompleteCardField);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

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
    window.scrollTo({ top: 0 });
    setAllowedStages({ two: true, three: true });
  };

  const checkboxHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleBillingAddress(!boxChecked));
    setBoxChecked((prev) => !prev);
    setInputErrors({});
  };

  const cardElementEventHandler = (
    e:
      | StripeCardNumberElementChangeEvent
      | StripeCardExpiryElementChangeEvent
      | StripeCardCvcElementChangeEvent
  ) => {
    setIncompleteError({
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
    });
    setCardErrors((prev) => {
      return { ...prev, [e.elementType]: e.error };
    });
    setCardComplete((prev) => {
      return { ...prev, [e.elementType]: e.complete };
    });
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
      "checkout"
    );
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.left_grid}>
        <div className={styles.sub_title}>BILLING ADDRESS</div>
        <div className={styles.billing_input}>
          <Checkbox
            onChange={checkboxHandler}
            checked={boxChecked}
            sx={{ "& .MuiSvgIcon-root": { fontSize: 40 } }}
          />
          USE MY SHIPPING ADDRESS FOR BILLING
        </div>
        <form onSubmit={stageChangeHandler}>
          {!boxChecked && inputFields(addressFields, billingAddress)}
          <div className={styles.payment_method}>
            <div className={styles.sub_title}>PAYMENT METHOD</div>
            <div className={styles.card_icons}>
              CREDIT CARD
              {card_icons.map((src) => {
                return (
                  <div key={src} className={styles.card_image}>
                    <Image src={src} alt={src} width={45} height={30} />
                  </div>
                );
              })}
            </div>

            <div className={styles.card_elements}>
              <StripeCardElement
                type="cardNumber"
                cardErorrs={cardErorrs}
                incompleteError={incompleteError}
                cardElementEventHandler={cardElementEventHandler}
              />

              <div className={styles.exp_ccv_grid}>
                <StripeCardElement
                  type="cardExpiry"
                  cardErorrs={cardErorrs}
                  incompleteError={incompleteError}
                  cardElementEventHandler={cardElementEventHandler}
                />
                <StripeCardElement
                  type="cardCvc"
                  cardErorrs={cardErorrs}
                  incompleteError={incompleteError}
                  cardElementEventHandler={cardElementEventHandler}
                />
              </div>
            </div>
          </div>
          <div className={styles.hint_box}>
            <div className={styles.hint_text}>
              HINT: For payment testing, please use 4242 4242 4242 4242 as the
              card number, a future date as the expiration date and any 3-digits
              number as the CVC
            </div>
          </div>

          <div className={styles.button_box}>
            <Button
              type="submit"
              variant="contained"
              onClick={stageChangeHandler}
              className={styles.button}
            >
              CONTINUE
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.right_grid}>
        <div className={styles.summary_grid}>
          <CartDetail cart={cart} summaryMode={true} />
        </div>
      </div>

      <div className={styles.button_box_sticky}>
        <Button
          variant="contained"
          onClick={stageChangeHandler}
          className={styles.button_sticky}
        >
          CONTINUE
        </Button>
      </div>
    </main>
  );
}

export default memo(CheckoutStage_2);

const card_icons = [
  "/card-icons/card-icon-1.jpg",
  "/card-icons/card-icon-2.jpg",
  "/card-icons/card-icon-3.jpg",
  "/card-icons/card-icon-4.jpg",
];

// NOTE //
/* In case you are using the CardNumberElement, CardExpiryElement, CardCvcElement, 
   just use "elements.getElement(CardNumberElement)" to grab the "CardNumberElement"
   the "elements.getElement" will automatically grab the Exp and CCV data
   the rest is the same as using <CardElement />
*/

/*
Stripe element change event object

brand: "visa"
complete: false
elementType: "cardNumber"
empty: false
error: {code: 'incomplete_number', type: 'validation_error', message: 'Your card number is incomplete.'}
value: undefined

 */
