import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
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

const CartPage: NextPage = ({}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart = useSelector(selectCart);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    if (cart && cart.length > 0) {
      dispatch(checkStock());
    }
  }, []);

  const preCheckoutHandler = () => {
    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity === 0) {
        dispatch(removeFromCartSession(i));
      }
    }
    router.push(
      isLoggedIn && currentUser.userId
        ? "/shop/checkout"
        : "/shop/login-checkout"
    );
  };

  return (
    <main>
      <h2>Shopping Cart</h2>
      <CartDetail cart={cart} />
      {cart.length > 0 && (
        <div>
          <button onClick={preCheckoutHandler}>Check Out</button>
        </div>
      )}
    </main>
  );
};

export default CartPage;
