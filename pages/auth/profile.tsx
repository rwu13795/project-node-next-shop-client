import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

import {
  CartItem,
  clearAuthErrors,
  selectProfileTagNum,
  setLoadingStatus,
  setProfileTagNum,
} from "../../utils/redux-store/userSlice";
import serverClient from "../../utils/axios-client/server-client";
import OrderHistory from "../../components/auth/user-profile/order-history";
import UpdateProfile from "../../components/auth/user-profile/update-info";
import ResetPassword from "../../components/auth/user-profile/reset-password";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { PaymentDetail } from "../../utils/redux-store/shopSlice";

// UI //
import { Box, Tab, Grid } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__profile.module.css";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";
import axios from "axios";

export interface OrderAddressFields {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  state: string;
  city: string;
  zip_code: string;
}

export interface Order {
  _id: string;
  date: string;
  total: number;
  items: CartItem[];
  shippingAddress: OrderAddressFields;
  paymentDetail: PaymentDetail;
}

interface PageProps {
  orders: Order[] | null;
  ordersTotal: number;
  notAuth?: boolean;
}

const ProfilePage: NextPage<PageProps> = ({ orders, ordersTotal, notAuth }) => {
  const dispatch = useDispatch();
  const tagNum = useSelector(selectProfileTagNum);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const tagChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(clearAuthErrors("all"));
    dispatch(setLoadingStatus("idle"));
    dispatch(setProfileTagNum(newValue));
  };

  if (notAuth === true) {
    return (
      <main className={styles.main_container}>
        <Head>
          <title>Customer Profile</title>
        </Head>
        <h1 style={{ textAlign: "center" }}>SIGN IN TO ACCESS YOUR PROFILE</h1>
      </main>
    );
  }

  return (
    <main className={styles.main_container}>
      <Head>
        <title>Customer Profile</title>
      </Head>

      <TabContext value={tagNum}>
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
            <Tab label="PERSONAL INFO" value={"1"} className={styles.tag} />
            <Tab label="ORDER HISTORY" value={"2"} className={styles.tag} />
            <Tab label="RESET PASSWORD" value={"3"} className={styles.tag} />
          </TabList>
        </Grid>

        <TabPanel value={"1"} className={styles.tab_container}>
          <UpdateProfile />
        </TabPanel>
        <TabPanel value={"2"} className={styles.tab_container}>
          <OrderHistory orders={orders!} ordersTotal={ordersTotal} />
        </TabPanel>
        <TabPanel value={"3"} className={styles.tab_container}>
          <ResetPassword />
        </TabPanel>
      </TabContext>
    </main>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/shop/get-order-history`
    );

    return {
      props: {
        orders: data.orders,
        ordersTotal: data.ordersTotal,

        page: "auth",
      },
    };
  } catch (err) {
    console.log(context);

    return { props: { orders: null, notAuth: true, page: "auth" } };
  }
}
