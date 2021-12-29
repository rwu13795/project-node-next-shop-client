import { useStripe } from "@stripe/react-stripe-js";
import { TokenResult } from "@stripe/stripe-js";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { memo, Dispatch, SetStateAction, useState } from "react";

import browserClient from "../../../utils/axios-client/browser-client";
import {
  createOrderHistory,
  selectBillingAddress,
  selectShippingAddress,
} from "../../../utils/redux-store/shopSlice";
import {
  selectCart,
  selectCsrfToken,
  selectCurrentUser,
  selectTotalAmount,
  updateStock,
} from "../../../utils/redux-store/userSlice";
import { AllowedStages } from "../../../pages/shop/checkout";
import PaymentProcessingModal from "./payment-processing-modal";
import CartDetail from "../cart/cart-detail";

// UI //
import { Button } from "@mui/material";
import styles from "./__stage.module.css";
import { capitalizeAddress } from "../../../utils/helper-functions/capitalize-first-letter";

interface Props {
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
  stripeCardToken: TokenResult | undefined;
}

function CheckoutStage_3({ stripeCardToken }: Props): JSX.Element {
  const client = browserClient();
  const stripe = useStripe();
  const router = useRouter();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const totalAmount = useSelector(selectTotalAmount);
  const csrfToken = useSelector(selectCsrfToken);
  const cart = useSelector(selectCart);
  const shippingAddress = useSelector(selectShippingAddress);
  const billingAddress = useSelector(selectBillingAddress);

  const [processing, setProcessing] = useState<boolean>(false);

  const capShippingAddress = capitalizeAddress(shippingAddress);
  const capBillingAddress = capitalizeAddress(billingAddress);

  const placeOrderHandler = async () => {
    if (!stripe || !stripeCardToken) return;

    setProcessing(true);

    let paymentIntent;
    try {
      // the paymentIntent response will be used immediately, so I do not use the
      // createAsyncThunk to make this request, and the csrfToken is selected from
      // the userSlice
      const { data } = await client.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/stripe-payment`,
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
    <main className={styles.main_container}>
      <div className={styles.left_grid}>
        <div className={styles.sub_title}>REVIEW ORDER</div>

        <div className={styles.addresses_box}>
          <div className={styles.address_inner_box}>
            <div className={styles.address_sub_title}>SHIPPING ADDRESS </div>
            <div>
              {capShippingAddress.first_name +
                " " +
                capShippingAddress.last_name}
            </div>
            <div>{capShippingAddress.address_1}</div>
            <div>{capShippingAddress.address_2}</div>
            <div>{`${capShippingAddress.city}, ${capShippingAddress.state} ${capShippingAddress.zip_code}`}</div>
            <div>Edit</div>
          </div>
          <div className={styles.address_inner_box}>
            <div className={styles.address_sub_title}>BILLING ADDRESS</div>
            <div>
              {capBillingAddress.first_name + " " + capBillingAddress.last_name}
            </div>
            <div>{capBillingAddress.address_1}</div>
            <div>{capBillingAddress.address_2}</div>
            <div>{`${capBillingAddress.city}, ${capBillingAddress.state} ${capBillingAddress.zip_code}`}</div>
            <div>Edit</div>
          </div>
        </div>

        <div className={styles.button_box}>
          <Button
            variant="contained"
            onClick={placeOrderHandler}
            className={styles.button}
          >
            PLACE ORDER
          </Button>
        </div>
      </div>

      <div className={styles.right_grid}>
        <div className={styles.summary_grid}>
          <CartDetail cart={cart} summaryMode={true} />
        </div>
      </div>

      <div className={styles.button_box_sticky}>
        <Button
          variant="contained"
          onClick={placeOrderHandler}
          className={styles.button_sticky}
        >
          PLACE ORDER
        </Button>
      </div>

      {processing && <PaymentProcessingModal />}
    </main>
  );
}

export default memo(CheckoutStage_3);
