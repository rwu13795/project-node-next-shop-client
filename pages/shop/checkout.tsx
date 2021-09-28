import { GetStaticPropsContext, NextPage } from "next";
import { useSelector } from "react-redux";
import { SyntheticEvent, useState } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCart,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import CheckoutForm from "../../components/shop/checkout-form";
import CartDetail from "../../components/shop/cart-detail";
import { InputValue } from "../../utils/react-hooks/input-error-check";
import {
  addressFields,
  selectAddressInfo,
} from "../../utils/redux-store/checkoutSlice";

export interface AllowedStages {
  two: boolean;
  three: boolean;
}

const paymentFields = [""];

const CheckoutPage: NextPage = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const addressInfo = useSelector(selectAddressInfo);
  const cart = useSelector(selectCart);

  const [stage, setStage] = useState<string>(inputTypes.addressInfo);
  const [allowedStages, setAllowedStages] = useState<AllowedStages>({
    two: false,
    three: false,
  });

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
              addressFields={addressFields}
              paymentFields={paymentFields}
              setStage={setStage}
              setAllowedStages={setAllowedStages}
            />
          </TabPanel>
          <TabPanel value={inputTypes.paymentInfo}>
            <CheckoutForm
              stage={stage}
              addressFields={addressFields}
              paymentFields={paymentFields}
              setStage={setStage}
              setAllowedStages={setAllowedStages}
            />
          </TabPanel>
          <TabPanel value={inputTypes.placeOrder}>Item Three</TabPanel>
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
