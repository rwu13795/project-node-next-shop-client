import { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";

import { Box, styled, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import UpdateProfile from "../../components/auth/user-profile/update-info";
import { useSelector } from "react-redux";
import {
  CartItem,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import { loadUserInfo } from "../../utils/redux-store/checkoutSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import serverClient from "../../utils/axios-client/server-client";
import OrderHistory from "../../components/auth/user-profile/order-history";

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
}

const ProfilePage: NextPage<PageProps> = ({ orders, ordersTotal, notAuth }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  console.log(orders);

  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (notAuth === true || orders === null) {
    return <h1>Sign in to see your profile</h1>;
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange}>
            <Tab label="PERSONAL INFO" value={"1"} />
            <Tab label="ORDER HISTORY" value={"2"} />
            <Tab label="RESET PASSWORD" value={"3"} />
          </TabList>
        </Box>
        <TabPanel value={"1"}>
          <UpdateProfile />
        </TabPanel>
        <TabPanel value={"2"}>
          <OrderHistory orders={orders!} ordersTotal={ordersTotal} />
        </TabPanel>
        <TabPanel value={"3"}>RESET PASSWORD</TabPanel>
      </TabContext>
    </Box>
  );
};

export default ProfilePage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  try {
    const { data }: { data: PageProps } = await client.post(
      "http://localhost:5000/api/shop/get-order-history"
    );

    console.log(data);

    return { props: { orders: data.orders, ordersTotal: data.ordersTotal } };
  } catch (err) {
    return { props: { orders: null, notAuth: true } };
  }
}
