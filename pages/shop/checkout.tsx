import { GetStaticPropsContext, NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { SyntheticEvent, useState } from "react";
import { Box, Tab, Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Elements, useStripe } from "@stripe/react-stripe-js";

import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
  selectTotalAmount,
} from "../../utils/redux-store/userSlice";
import CheckoutForm from "../../components/shop/checkout-form";
import CartDetail from "../../components/shop/cart-detail";
import { InputValue } from "../../utils/react-hooks/input-error-check";
import {
  selectShippingAddress,
  selectBillingAddress,
  setShippingAddress,
  setBillingAddress,
  createOrderHistory,
} from "../../utils/redux-store/checkoutSlice";
import { stripePromise } from "../../utils/helper-functions/load-stripe";
import { StripeCardElement, TokenResult } from "@stripe/stripe-js";
import browserClient from "../../utils/axios-client/browser-client";
import { useRouter } from "next/dist/client/router";

export interface AllowedStages {
  two: boolean;
  three: boolean;
}

const CheckoutPage: NextPage = ({}) => {
  const client = browserClient();
  const stripe = useStripe();
  const router = useRouter();
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cart = useSelector(selectCart);
  const currentUser = useSelector(selectCurrentUser);
  const totalAmount = useSelector(selectTotalAmount);

  const [stage, setStage] = useState<string>(inputTypes.addressInfo);
  const [allowedStages, setAllowedStages] = useState<AllowedStages>({
    two: false,
    three: false,
  });
  const [stripeCardToken, setStripeCardToken] = useState<TokenResult>();
  const [checkoutError, setCheckoutError] = useState();

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);
    if (newValue === inputTypes.addressInfo) {
      setAllowedStages({ two: false, three: false });
    }
    if (newValue === inputTypes.paymentInfo) {
      setAllowedStages({ two: true, three: false });
    }
  };

  const placeOrderHandler = async () => {
    let paymentIntent;
    try {
      const { data } = await client.post(
        "http://localhost:5000/api/shop/stripe-payment",
        {
          totalAmount,
        }
      );
      paymentIntent = data;
    } catch (err) {
      console.log(err);
    }

    if (!stripe || !stripeCardToken) return;

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
      console.error(error);
      // if there is an error, "Stripe" will return a "payment_intent" object
      // and we can use it to update the payment info for this order in our server
      console.log(error);
    } else {
      ////
      console.log("payment succeeded");
      ////
      dispatch(createOrderHistory(currentUser));

      router.push("/shop/payment-successful");
    }
  };

  return (
    <main>
      <h1>Check Out Page</h1>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={stage}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={tagChangeHandler}>
              <Tab label="SHIPPING INFO" value={inputTypes.addressInfo} />
              <Tab
                label="PAYMENT INFO"
                value={inputTypes.paymentInfo}
                disabled={!allowedStages.two}
              />
              <Tab
                label="PLACE ORDER"
                value={inputTypes.placeOrder}
                disabled={!allowedStages.three}
              />
            </TabList>
          </Box>
          <TabPanel value={inputTypes.addressInfo}>
            <CheckoutForm
              stage={stage}
              setStage={setStage}
              setAllowedStages={setAllowedStages}
            />
          </TabPanel>
          <TabPanel value={inputTypes.paymentInfo}>
            <CheckoutForm
              stage={stage}
              setStage={setStage}
              setAllowedStages={setAllowedStages}
              setStripeCardToken={setStripeCardToken}
            />
            <h3>Payment method in the page, not in component</h3>
          </TabPanel>
          <TabPanel value={inputTypes.placeOrder}>
            <h3>REVIEW ORDER</h3>
            <div>
              <Button variant="contained" onClick={placeOrderHandler}>
                PLACE ORDER
              </Button>
            </div>
            <button></button>
          </TabPanel>
        </TabContext>
      </Box>
      <hr></hr>
      <div>Order Summary</div>
      <CartDetail cart={cart} summaryMode={true} />
      <hr />
    </main>
  );
};

export default CheckoutPage;

export async function getServerSideProps(context: GetStaticPropsContext) {
  const userId = context.params?.userId as string;

  if (!userId) {
    return { props: {} };
  }

  return { props: {} };
}
