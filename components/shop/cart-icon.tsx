import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import {
  selectCart,
  selectChangeInCart,
  setChangeInCart,
} from "../../utils/redux-store/userSlice";

import { Collapse, Box, Fade, Paper } from "@mui/material";
import CartDetail from "./cart-detail";

export default function CartIcon(): JSX.Element {
  const changeInCart = useSelector(selectChangeInCart);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showCart, setShowCart] = useState<boolean>(false);

  useEffect(() => {
    if (changeInCart) {
      setShowCart(true);
      setTimeout(() => {
        dispatch(setChangeInCart(false));
        setShowCart(false);
      }, 5000);
    }
  }, [changeInCart, dispatch]);

  return (
    <div
      onMouseEnter={() => setShowCart(true)}
      onMouseLeave={() => setShowCart(false)}
    >
      <div
        onClick={() => {
          router.push("/shop/cart");
          setShowCart(false);
        }}
      >
        Cart {cart.length}
      </div>
      <div
        style={{
          position: "absolute",
          right: "1rem",
          zIndex: 99,
        }}
      >
        <Box>
          <Collapse in={showCart}>
            <div
              style={{
                minHeight: "200px",
                minWidth: "200px",
                border: "red solid 2px",
                boxShadow: "1rem",
                marginTop: "0.5rem",
                backgroundColor: "pink",
              }}
            >
              <div>
                <CartDetail
                  cart={cart}
                  summaryMode={true}
                  cartDropDown={true}
                />
              </div>

              <div>
                <button onClick={() => router.push("/shop/cart")}>
                  Go To Cart
                </button>
                <button onClick={() => setShowCart(false)}>Close</button>
              </div>
            </div>
          </Collapse>
        </Box>
      </div>
    </div>
  );
}
