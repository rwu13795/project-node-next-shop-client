import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

import {
  selectCart,
  selectCurrentUser,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import CartDetail from "../../components/shop/cart-detail";

const CartPage: NextPage = ({}) => {
  const cart = useSelector(selectCart);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  return (
    <main>
      <h2>Shopping Cart</h2>
      <CartDetail cart={cart} />
      <div>
        <Link
          href={
            isLoggedIn && currentUser.userId
              ? `/shop/checkout?userId=${currentUser.userId}`
              : "/shop/login-checkout"
          }
        >
          <a>
            <button>Check Out</button>
          </a>
        </Link>
      </div>
    </main>
  );
};

export default CartPage;
