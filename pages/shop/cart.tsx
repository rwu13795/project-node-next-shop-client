import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  checkStock,
  removeFromCartSession,
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import CartDetail from "../../components/shop/cart/cart-detail";

// UI //
import styles from "./__cart.module.css";

const CartPage: NextPage = ({}) => {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);

  useEffect(() => {
    if (cart && cart.length > 0) {
      dispatch(checkStock());
    }
  }, []);

  return (
    <main className={styles.main_container}>
      <div className={styles.main_title}>Shopping Cart</div>
      <CartDetail cart={cart} />
    </main>
  );
};

export default CartPage;
