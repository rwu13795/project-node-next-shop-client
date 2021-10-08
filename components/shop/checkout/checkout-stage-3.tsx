import { useStripe } from "@stripe/react-stripe-js";
import { TokenResult } from "@stripe/stripe-js";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@mui/material";

import browserClient from "../../../utils/axios-client/browser-client";
import { createOrderHistory } from "../../../utils/redux-store/checkoutSlice";
import {
  clearCartSession,
  selectCsrfToken,
  selectCurrentUser,
  selectTotalAmount,
  updateStock,
} from "../../../utils/redux-store/userSlice";
import { useState } from "react";
import PaymentProcessingModal from "./payment-processing-modal";

interface Props {
  stripeCardToken: TokenResult | undefined;
}

export default function CheckoutStage_3({
  stripeCardToken,
}: Props): JSX.Element {
  const client = browserClient();
  const stripe = useStripe();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const totalAmount = useSelector(selectTotalAmount);
  const csrfToken = useSelector(selectCsrfToken);

  console.log("token in checkout", csrfToken);

  const [processing, setProcessing] = useState<boolean>(false);

  const placeOrderHandler = async () => {
    if (!stripe || !stripeCardToken) return;

    setProcessing(true);

    let paymentIntent;
    try {
      // the paymentIntent response will be used immediately, so I do no use the
      // createAsyncThunk to make this request, and the csrfToken is selected from
      // the userSlice
      const { data } = await client.post(
        "http://localhost:5000/api/shop/stripe-payment",
        {
          totalAmount,
          csrfToken,
        }
      );
      paymentIntent = data;
    } catch (err) {
      console.log(err);
      return;
    }
    //////////
    // NOTE //
    //////////
    // the value inside the cardElement will be destoyed whenever this component is
    // dismounted. I need to create a onc-time-use token using the cardElement,
    // and pass the "token" back the checkout page, where the "confirmCardPayment" takes place,
    const { paymentIntent: updatedPaymentIntent, error } =
      await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: { card: { token: stripeCardToken.token!.id } },
      });

    if (error) {
      // if there is an error, "Stripe" will return a "payment_intent" object
      // and we can use it to update the payment info for this order in our server
      console.log(error);
    } else {
      dispatch(
        createOrderHistory({
          currentUser,
          totalAmount,
          paymentDetail: {
            payment_processer: "Stripe",
            payment_method: updatedPaymentIntent?.payment_method,
            payment_id: updatedPaymentIntent?.id,
            payment_status: updatedPaymentIntent?.status,
          },
        })
      );
      dispatch(updateStock());
      router.push("/shop/payment-successful");
    }
  };

  return (
    <main>
      <h3>REVIEW ORDER</h3>
      <div>
        <Button variant="contained" onClick={placeOrderHandler}>
          PLACE ORDER
        </Button>
      </div>
      {processing && <PaymentProcessingModal />}
    </main>
  );
}
