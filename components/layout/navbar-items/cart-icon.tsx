import { useEffect, useState, MouseEvent, Fragment, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import {
  selectCart,
  selectChangeInCart,
  setChangeInCart,
} from "../../../utils/redux-store/userSlice";
import CartDetail from "../../shop/cart/cart-detail";

// UI //
import {
  Collapse,
  Box,
  Fade,
  Paper,
  Menu,
  IconButton,
  Tooltip,
} from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import LocalMallSharpIcon from "@mui/icons-material/LocalMallSharp";
import styles from "./__cart-icon.module.css";

interface Props {
  showCart: boolean;
  openCartDropDown: () => void;
  closeCartDropDown: () => void;
}

function CartIcon({
  showCart,
  openCartDropDown,
  closeCartDropDown,
}: Props): JSX.Element {
  const changeInCart = useSelector(selectChangeInCart);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    let timerId: any;
    if (changeInCart) {
      openCartDropDown();
      timerId = setTimeout(() => {
        dispatch(setChangeInCart(false));
        closeCartDropDown();
      }, 5000);
    }
    return () => {
      clearTimeout(timerId);
    };
  }, [changeInCart, dispatch, closeCartDropDown, openCartDropDown]);

  const handleClick = () => {
    closeCartDropDown();
    router.push("/shop/cart");
  };

  return (
    <Fragment>
      <Box onClick={handleClick} onMouseEnter={openCartDropDown}>
        <LocalMallIcon className={styles.cart_icon} />
      </Box>
      <div className={styles.cart_icon_number}>
        {cart.length > 0
          ? cart
              .map((item) => item.quantity)
              .reduce((prev, accum) => prev + accum)
          : 0}
      </div>

      <Collapse
        in={showCart}
        className={styles.cart_collapse_box}
        sx={{ display: { xs: "none", sm: "none", md: "block" } }}
      >
        <Paper
          onMouseLeave={closeCartDropDown}
          // elevation={10}
          // sx={{ filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))" }}
          className={styles.cart_summary_menu}
        >
          <div>
            <CartDetail
              cart={cart}
              cartDropDown={true}
              closeCartDropDown={closeCartDropDown}
              viewCart={handleClick}
            />
          </div>
        </Paper>
      </Collapse>
    </Fragment>
  );
}

export default memo(CartIcon);
