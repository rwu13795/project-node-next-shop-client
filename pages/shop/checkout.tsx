import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { SyntheticEvent, useEffect, useState } from "react";

import { TokenResult } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../../utils/helper-functions/load-stripe";

import { Box, Tab, Grid } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { inputNames } from "../../utils/enums-types/input-names";
import {
  checkStock,
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";

import CartDetail from "../../components/shop/cart/cart-detail";
import { loadUserInfo } from "../../utils/redux-store/shopSlice";
import CheckoutStage_1 from "../../components/shop/checkout/checkout-stage-1";
import CheckoutStage_2 from "../../components/shop/checkout/checkout-stage-2";
import CheckoutStage_3 from "../../components/shop/checkout/checkout-stage-3";

export interface AllowedStages {
  two: boolean;
  three: boolean;
}

const CheckoutPage: NextPage = ({}) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cart = useSelector(selectCart);
  const currentUser = useSelector(selectCurrentUser);

  const [stage, setStage] = useState<string>("1");
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
            [inputNames.first_name]: currentUser.userInfo!.first_name,
            [inputNames.last_name]: currentUser.userInfo!.last_name,
            [inputNames.address_1]: currentUser.userInfo!.address_1,
            [inputNames.address_2]: currentUser.userInfo!.address_2,
            [inputNames.city]: currentUser.userInfo!.city,
            [inputNames.state]: currentUser.userInfo!.state,
            [inputNames.zip_code]: currentUser.userInfo!.zip_code,
          },
          contactInfo: {
            [inputNames.email]: currentUser.email!,
            [inputNames.phone]: currentUser.userInfo!.phone,
          },
        })
      );
    }
  }, [isLoggedIn, currentUser, dispatch]);

  useEffect(() => {
    if (cart && cart.length > 0) {
      dispatch(checkStock());
    }
  }, []);

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);

    console.log(newValue);

    if (newValue === "1") {
      setAllowedStages({ two: false, three: false });
    } else if (newValue === "2") {
      setAllowedStages({ two: true, three: false });
    } else {
      setAllowedStages({ two: true, three: true });
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
                <Grid container justifyContent="space-evenly" wrap="nowrap">
                  <TabList onChange={tagChangeHandler}>
                    <Tab
                      label="SHIPPING INFO"
                      value={"1"}
                      sx={{ typography: "h3" }}
                    />
                    <Tab
                      label="PAYMENT INFO"
                      value={"2"}
                      disabled={!allowedStages.two}
                      sx={{ typography: "h3" }}
                    />
                    <Tab
                      label="PLACE ORDER"
                      value={"3"}
                      disabled={!allowedStages.three}
                      sx={{ typography: "h3" }}
                    />
                    {/*  */}
                  </TabList>
                </Grid>
              </Box>
              <TabPanel value={"1"}>
                <CheckoutStage_1
                  setStage={setStage}
                  setAllowedStages={setAllowedStages}
                />
              </TabPanel>
              <TabPanel value={"2"}>
                <CheckoutStage_2
                  setStage={setStage}
                  setAllowedStages={setAllowedStages}
                  setStripeCardToken={setStripeCardToken}
                />
              </TabPanel>
              <TabPanel value={"3"}>
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
