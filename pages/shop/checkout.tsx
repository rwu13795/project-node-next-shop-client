import { NextPage } from "next";
import { useDispatch, useSelector } from "react-redux";
import { SyntheticEvent, useEffect, useState } from "react";
import { TokenResult } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Head from "next/head";

import { stripePromise } from "../../utils/helper-functions/load-stripe";
import { inputNames } from "../../utils/enums-types/input-names";
import {
  checkStock,
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
  setPageLoading_user,
} from "../../utils/redux-store/userSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import { loadUserInfo } from "../../utils/redux-store/shopSlice";
import CheckoutStage_1 from "../../components/shop/checkout/checkout-stage-1";
import CheckoutStage_2 from "../../components/shop/checkout/checkout-stage-2";
import CheckoutStage_3 from "../../components/shop/checkout/checkout-stage-3";

// UI //
import { Box, Tab, Grid } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__checkout.module.css";

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

  useEffect(() => {
    dispatch(setPageLoading(false));
    dispatch(setPageLoading_user(false));
  });

  const tagChangeHandler = (event: SyntheticEvent, newValue: string) => {
    setStage(newValue);

    if (newValue === "1") {
      setAllowedStages({ two: false, three: false });
    } else if (newValue === "2") {
      setAllowedStages({ two: true, three: false });
    } else {
      setAllowedStages({ two: true, three: true });
    }
  };

  return cart.length > 0 ? (
    <Elements stripe={stripePromise}>
      <main className={styles.main_container}>
        <Head>
          <title>Checkout</title>
        </Head>

        <div className={styles.main_title}>CHECKOUT</div>

        <Box className={styles.body}>
          <TabContext value={stage}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Grid
                container
                justifyContent="space-evenly"
                wrap="nowrap"
                className={styles.tags_title_container}
              >
                <TabList
                  onChange={tagChangeHandler}
                  variant="scrollable"
                  allowScrollButtonsMobile
                >
                  <Tab
                    label="SHIPPING INFO"
                    value={"1"}
                    className={styles.tag}
                  />
                  <Tab
                    label="PAYMENT INFO"
                    value={"2"}
                    disabled={!allowedStages.two}
                    className={styles.tag}
                  />
                  <Tab
                    label="PLACE ORDER"
                    value={"3"}
                    disabled={!allowedStages.three}
                    className={styles.tag}
                  />
                </TabList>
              </Grid>
            </Box>
            <TabPanel value={"1"} className={styles.tab_container}>
              <CheckoutStage_1
                setStage={setStage}
                setAllowedStages={setAllowedStages}
              />
            </TabPanel>
            <TabPanel value={"2"} className={styles.tab_container}>
              <CheckoutStage_2
                setStage={setStage}
                setAllowedStages={setAllowedStages}
                setStripeCardToken={setStripeCardToken}
              />
            </TabPanel>
            <TabPanel value={"3"} className={styles.tab_container}>
              <CheckoutStage_3
                setStage={setStage}
                setAllowedStages={setAllowedStages}
                stripeCardToken={stripeCardToken}
              />
            </TabPanel>
          </TabContext>
        </Box>
      </main>
    </Elements>
  ) : (
    <main className={styles.main_container_no_item}>
      <Head>
        <title>Checkout</title>
      </Head>

      <div className={styles.main_title}>CHECKOUT</div>
      <div className={styles.no_item_text}>
        You don&apos;t have any item in the cart
      </div>
    </main>
  );
};

export default CheckoutPage;

export function getServerSideProps() {
  return { props: { page: "checkout" } };
}
