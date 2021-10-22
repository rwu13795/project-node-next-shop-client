import { useEffect, useState, MouseEvent, Fragment, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import { Collapse, Box, Fade, Paper, Menu, IconButton } from "@mui/material";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";

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

  const cartRef = useRef<HTMLDivElement | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const showCart = Boolean(anchorEl);

  useEffect(() => {
    if (changeInCart) {
      setAnchorEl(cartRef.current);
      setTimeout(() => {
        dispatch(setChangeInCart(false));
        setAnchorEl(null);
      }, 5000);
    }
  }, [changeInCart, dispatch]);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    router.push("/shop/cart");
    setAnchorEl(null);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <div ref={cartRef}>
        <IconButton
          onClick={handleClick}
          onMouseEnter={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <LocalMallOutlinedIcon className={classes.cart_icon} />
        </IconButton>
        <div className={classes.cart_icon_number}>{cart.length}</div>
      </div>
      <Menu
        disableScrollLock={true}
        anchorEl={anchorEl}
        open={showCart}
        onClose={closeMenu}
        onClick={closeMenu}
        PaperProps={{
          elevation: 10,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            // these 2 lines above are for the litte triangle pointer
            borderRadius: 0,
            borderColor: "black",
            border: 2,
            zIndex: 1,
            mt: 1,
            // "&:after": {
            //   content: '""',
            //   display: "block",
            //   position: "absolute",
            //   top: 0,
            //   right: 16,
            //   width: 10,
            //   height: 10,
            //   bgcolor: "white",
            //   transform: "translateY(-50%) rotate(45deg)",
            //   borderColor: "black",
            //   border: 2,
            //   zIndex: 0,
            // },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <div style={{ minWidth: "350px" }}>
          <CartDetail cart={cart} summaryMode={true} cartDropDown={true} />
        </div>

        <div>
          <button onClick={() => router.push("/shop/cart")}>Go To Cart</button>
          <button onClick={() => setAnchorEl(null)}>Close</button>
        </div>
      </Menu>
    </Fragment>

    // </div>
  );
}
