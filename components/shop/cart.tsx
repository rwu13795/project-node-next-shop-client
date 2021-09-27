import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import {
  selectCart,
  selectChangeInCart,
  setChangeInCart,
} from "../../utils/redux-store/userSlice";

import { Collapse, Box, Fade, Paper } from "@mui/material";

export default function CartIcon(): JSX.Element {
  const newItemAdded = useSelector(selectChangeInCart);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const router = useRouter();

  const [showCart, setShowCart] = useState<boolean>(false);

  useEffect(() => {
    if (newItemAdded) {
      setShowCart(true);
      setTimeout(() => {
        dispatch(setChangeInCart(false));
        setShowCart(false);
      }, 5000);
    }
  }, [newItemAdded, dispatch]);

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
        }}
      >
        <Box>
          <Collapse in={showCart}>
            <div
              style={{
                height: "200px",
                width: "200px",
                border: "red solid 2px",
                boxShadow: "1rem",
                marginTop: "0.5rem",
                backgroundColor: "pink",
              }}
            >
              <div>Showing cart</div>
              <div>
                <button onClick={() => setShowCart(false)}>Close</button>
              </div>
            </div>
          </Collapse>
        </Box>
      </div>
    </div>
  );
}
