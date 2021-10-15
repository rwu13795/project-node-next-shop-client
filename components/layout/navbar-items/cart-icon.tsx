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

import styles from "./__.module.css";

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
          size="medium"
          onClick={handleClick}
          onMouseEnter={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          <LocalMallOutlinedIcon
            sx={{
              width: "7.5vw",
              height: "7.5vw",
              color: "black",
              maxWidth: "75px",
              maxHeight: "75px",
            }}
          />
        </IconButton>
        <div
          className={styles.cart_icon_text}
          style={{
            position: "absolute",
            top: "0.5rem",
            right: "0.5rem",
            backgroundColor: "black",
            color: "white",
            borderRadius: "1.5rem",
            width: "4.6vw",
            height: "4.6vw",
            maxWidth: "42px",
            maxHeight: "42px",
            textAlign: "center",
          }}
        >
          {cart.length}
        </div>
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
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: 0,
              mr: 0,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 16,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
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
