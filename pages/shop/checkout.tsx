import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { SyntheticEvent, useEffect, useState } from "react";

import { TokenResult } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/helper-functions/load-stripe";

import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";

import CartDetail from "../../components/shop/cart-detail";
import { loadUserInfo } from "../../utils/redux-store/checkoutSlice";
import CheckoutStage_1 from "../../components/shop/checkout-stage-1";
import CheckoutStage_2 from "../../components/shop/checkout-stage-2";
import CheckoutStage_3 from "../../components/shop/checkout-stage-3";

export interface AllowedStages {
  two: boolean;
  three: boolean;
}

const CheckoutPage: NextPage = ({}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cart = useSelector(selectCart);
  const currentUser = useSelector(selectCurrentUser);

  const [stage, setStage] = useState<string>(inputTypes.addressInfo);
  const [allowedStages, setAllowedStages] = useState<AllowedStages>({
    two: false,
    three: false,
  });
  const [stripeCardToken, setStripeCardToken] = useState<TokenResult>();

  // const [checkoutError, setCheckoutError] = useState();

  // if user is logged in, load the addressInfo from the currentUser
  // to the shippingAddress of the checkoutSlice
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(
        loadUserInfo({
          addressInfo: {
            [inputNames.first_name]: currentUser.firstName!,
            [inputNames.last_name]: currentUser.lastName!,
            [inputNames.address_1]: currentUser.addressInfo!.address_1,
            [inputNames.address_2]: currentUser.addressInfo!.address_2,
            [inputNames.state]: currentUser.addressInfo!.state,
            [inputNames.city]: currentUser.addressInfo!.city,
            [inputNames.zip_code]: currentUser.addressInfo!.zip_code,
          },
          contactInfo: {
            [inputNames.email]: currentUser.email!,
            [inputNames.phone]: currentUser.phone!,
          },
        })
      );
    }
  }, [isLoggedIn, currentUser, dispatch]);

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);
    if (newValue === inputTypes.addressInfo) {
      setAllowedStages({ two: false, three: false });
    }
    if (newValue === inputTypes.paymentInfo) {
      setAllowedStages({ two: true, three: false });
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <main>
        <h1>Check Out Page</h1>
        {cart.length > 0 && (
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
                <CheckoutStage_1
                  setStage={setStage}
                  setAllowedStages={setAllowedStages}
                />
              </TabPanel>
              <TabPanel value={inputTypes.paymentInfo}>
                <CheckoutStage_2
                  setStage={setStage}
                  setAllowedStages={setAllowedStages}
                  setStripeCardToken={setStripeCardToken}
                />
              </TabPanel>
              <TabPanel value={inputTypes.placeOrder}>
                <CheckoutStage_3 stripeCardToken={stripeCardToken} />
              </TabPanel>
            </TabContext>
          </Box>
        )}

        <hr></hr>
        <div>Order Summary</div>
        <CartDetail cart={cart} summaryMode={true} />
        <hr />
      </main>
    </Elements>
  );
};

export default CheckoutPage;
