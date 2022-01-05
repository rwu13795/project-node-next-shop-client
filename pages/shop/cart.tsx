import { NextPage } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from "next/head";

import { checkStock, selectCart } from "../../utils/redux-store/userSlice";
import CartDetail from "../../components/shop/cart/cart-detail";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";

// UI //
import styles from "./__cart.module.css";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

const CartPage: NextPage = ({}) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  useEffect(() => {
    if (cart && cart.length > 0) {
      dispatch(checkStock());
    }
  }, []);

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  const main_container =
    cart.length > 0 ? styles.main_container : styles.main_container_no_item;

  return (
    <main className={main_container}>
      <Head>
        <title>Cart</title>
      </Head>

      <div className={styles.main_title}>SHOPPING CART</div>
      <CartDetail cart={cart} />
    </main>
  );
};

export default CartPage;
