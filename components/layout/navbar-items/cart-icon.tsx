import { useEffect, useState, MouseEvent, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import { Collapse, Box, Fade, Paper, Menu, IconButton } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalMallSharpIcon from "@mui/icons-material/LocalMallSharp";

import {
  selectCart,
  selectChangeInCart,
  setChangeInCart,
} from "../../../utils/redux-store/userSlice";
import CartDetail from "../../shop/cart/cart-detail";

import classes from "./_cart-icon.module.css";

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

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setShowCart(false);
    router.push("/shop/cart");
  };
  const openMenu = () => {
    setShowCart(true);
  };
  const closeMenu = () => {
    setShowCart(false);
  };

  return (
    <Fragment>
      <Box onClick={handleClick} onMouseEnter={openMenu}>
        <LocalMallIcon className={classes.cart_icon} />
      </Box>
      <div className={classes.cart_icon_number}>{cart.length}</div>

      <Collapse
        in={showCart}
        className={classes.cart_collapse_box}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <Paper
          onMouseLeave={closeMenu}
          // elevation={10}
          // sx={{ filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))" }}
          className={classes.cart_summary_menu}
        >
          <div>
            <CartDetail cart={cart} summaryMode={true} cartDropDown={true} />
          </div>
          <div>
            <button onClick={handleClick}>Go To Cart</button>
            <button onClick={closeMenu}>Close</button>
          </div>
        </Paper>
      </Collapse>
    </Fragment>
  );
}
