import { Fragment, CSSProperties } from "react";
import {
  CardElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import {
  StripeCardNumberElementChangeEvent,
  StripeCardExpiryElementChangeEvent,
  StripeCardCvcElementChangeEvent,
} from "@stripe/stripe-js";

import { CardErrors, IncompleteError } from "./checkout-stage-2";

// UI //
import {
  Button,
  Checkbox,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import styles from "./__card-elements.module.css";

interface Props {
  type: string;
  cardErorrs: CardErrors;
  incompleteError: IncompleteError;
  cardElementEventHandler: (
    e:
      | StripeCardNumberElementChangeEvent
      | StripeCardExpiryElementChangeEvent
      | StripeCardCvcElementChangeEvent
  ) => void;
}

export default function StripeCardElement({
  type,
  cardErorrs,
  incompleteError,
  cardElementEventHandler,
}: Props): JSX.Element {
  let id: string = "";
  let title = "CARD NUMBER";
  let outer_box = styles.card_input_outer_box;
  let label_right = styles.card_label_border_right;
  let cardElement = (
    <CardNumberElement
      onChange={cardElementEventHandler}
      className={styles.card_input_field}
      options={cardElemStyle}
    />
  );

  if (type === "cardNumber") {
    id = "cardNumber";
  } else if (type === "cardExpiry") {
    id = "cardExpiry";
    title = "EXPIRATION";
    outer_box = styles.card_input_outer_box_2;
    label_right = styles.card_label_border_right_2;
    cardElement = (
      <CardExpiryElement
        onChange={cardElementEventHandler}
        className={styles.card_input_field}
        options={cardElemStyle}
      />
    );
  } else {
    id = "cardCvc";
    title = "CVC";
    outer_box = styles.card_input_outer_box_2;
    label_right = styles.card_label_border_right_3;
    cardElement = (
      <CardCvcElement
        onChange={cardElementEventHandler}
        className={styles.card_input_field}
        options={cardElemStyle}
      />
    );
  }

  let label_left = styles.card_label_border_left_none;
  let card_input_box = styles.card_input_box;
  let label_color: CSSProperties = {};
  if (cardErorrs[id] || incompleteError[id]) {
    label_left = styles.card_label_border_left;
    card_input_box = styles.card_input_box_error;
    label_color = { color: "red" };
  } else {
    label_right = "";
  }

  return (
    <Fragment>
      <div id={id} className={outer_box}>
        <div className={styles.card_label_border_container}>
          <div className={label_left}></div>
          <span className={styles.card_label} style={label_color}>
            {title}
          </span>
          <div className={label_right}></div>
        </div>
        <div className={card_input_box}>{cardElement}</div>

        {type !== "cardNumber" && (
          <FormHelperText className={styles.card_input_error}>
            {cardErorrs[id]?.message}
            {incompleteError[id]}
          </FormHelperText>
        )}
      </div>
      {type === "cardNumber" && (
        <FormHelperText className={styles.card_input_error}>
          {cardErorrs[id]?.message}
          {incompleteError[id]}
        </FormHelperText>
      )}
    </Fragment>
  );
}

const cardElemStyle = {
  style: {
    base: {
      color: "black",
      fontFamily: "Oswald, sans-serif, monospace",
      fontSize: "26px",
      "::placeholder": {
        color: "#CFD7DF",
      },
    },
    invalid: {
      color: "red",
      "::placeholder": {
        color: "#FFCCA5",
      },
    },
  },
};
