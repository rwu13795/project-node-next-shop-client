import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Box, styled, Tab, Grid } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { CartItem, setLoadingStatus } from "../../utils/redux-store/userSlice";
import serverClient from "../../utils/axios-client/server-client";
import OrderHistory from "../../components/auth/user-profile/order-history";
import UpdateProfile from "../../components/auth/user-profile/update-info";
import ResetPassword from "../../components/auth/user-profile/reset-password";
import { inputNames } from "../../utils/enums-types/input-names";

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
export interface Order {
  _id: string;
  date: string;
  total: number;
  items: CartItem[];
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

  const tagChangeHandler = (event: React.SyntheticEvent, newValue: string) => {
    dispatch(setLoadingStatus("idle"));
    setValue(newValue);
  };

  if (notAuth === true || orders === null) {
    return <h1>Sign in to see your profile</h1>;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Grid container justifyContent="space-evenly" wrap="nowrap">
            <TabList onChange={tagChangeHandler}>
              <Tab label="PERSONAL INFO" value={"1"} />
              <Tab label="ORDER HISTORY" value={"2"} />
              <Tab label="RESET PASSWORD" value={"3"} />
            </TabList>
          </Grid>
        </Box>
        <TabPanel value={"1"}>
          <UpdateProfile />
        </TabPanel>
        <TabPanel value={"2"}>
          <OrderHistory orders={orders!} ordersTotal={ordersTotal} />
        </TabPanel>
        <TabPanel value={"3"}>
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
    const { data }: { data: PageProps } = await client.post(
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
