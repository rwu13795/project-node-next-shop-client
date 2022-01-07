import { NextPage } from "next";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Head from "next/head";

import {
  clearCheckoutInfo,
  selectCurrentOrder,
} from "../../utils/redux-store/shopSlice";
import {
  clearCartSession,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import OrderDetail from "../../components/auth/user-profile/order-detail";

// UI //
import styles from "./__payment-successful.module.css";

const PaymentSuccessful: NextPage = ({}) => {
  const dispatch = useDispatch();
  const currentOrder = useSelector(selectCurrentOrder);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    dispatch(clearCartSession());
    dispatch(clearCheckoutInfo());
  });

  return (
    <main className={styles.main_container}>
      <Head>
        <title>Thank You!</title>
      </Head>

      <div className={styles.main_title}>Thank you for your purchase!</div>

      {!isLoggedIn && (
        <div className={styles.sub_text}>
          An email which contains the Order ID has been sent to the email
          address you provided. You can use this Order ID to{" "}
          <Link href="/shop/order-status">Track Your Order</Link>
        </div>
      )}

      {/* index=999 is to signal that the order detail is to be displayed in the
      successful checkout page */}
      <div className={styles.main_grid}>
        {currentOrder && <OrderDetail order={currentOrder} index={999} />}
      </div>
    </main>
  );
};

export default PaymentSuccessful;
