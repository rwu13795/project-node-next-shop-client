import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  CartItem,
  clearAuthErrors,
  setLoadingStatus,
} from "../../utils/redux-store/userSlice";
import serverClient from "../../utils/axios-client/server-client";
import OrderHistory from "../../components/auth/user-profile/order-history";
import UpdateProfile from "../../components/auth/user-profile/update-info";
import ResetPassword from "../../components/auth/user-profile/reset-password";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import { PaymentDetail } from "../../utils/redux-store/shopSlice";

// UI //
import { Box, styled, Tab, Grid } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import styles from "./__profile.module.css";

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
  tabNum?: string;
}

const ProfilePage: NextPage<PageProps> = ({
  orders,
  ordersTotal,
  notAuth,
  tabNum,
}) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState(tabNum ? tabNum : "2");

  useEffect(() => {
    return instantlyToTop();
  });

  const tagChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(clearAuthErrors("all"));
    dispatch(setLoadingStatus("idle"));
    setValue(newValue);
  };

  if (notAuth === true) {
    return <h1>SIGN IN TO ACCESS YOUR PROFILE</h1>;
  }

  return (
    <Box className={styles.main_container}>
      <TabContext value={value}>
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
    </Box>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);
  const tabNum = context.query.tab;

  try {
    const { data }: { data: PageProps } = await client.get(
      "http://localhost:5000/api/shop/get-order-history"
    );

    console.log(data);

    return {
      props: {
        orders: data.orders,
        ordersTotal: data.ordersTotal,
        tabNum,
        page: "auth",
      },
    };
  } catch (err) {
    return { props: { orders: null, notAuth: true, page: "auth" } };
  }
}

// export const Tab_styled = styled(Tab)(({ theme }) => ({
//   "&.Mui-selected": {
//     // backgroundColor: "black",
//     // color: "#ffffff",
//     // "&:hover": { backgroundColor: "black" },
//     // "&:active": { backgroundColor: "grey" },
//     // border: "solid",
//   },
//   //   "&:hover": {
//   //     backgroundColor: theme.palette.info.light,
//   //     color: "white",
//   //   },
//   //   "&:active": {
//   //     backgroundColor: "grey",
//   //   },
// }));
