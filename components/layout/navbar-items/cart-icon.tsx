import { useEffect, Fragment, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";
import Image from "next/image";
import Link from "next/link";

import {
  selectCart,
  selectChangeInCart,
  setChangeInCart,
} from "../../../utils/redux-store/userSlice";
import CartDetail from "../../shop/cart/cart-detail";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import {
  Collapse,
  Box,
  Paper,
  ModalProps,
  Modal,
  styled,
  Slide,
  Button,
} from "@mui/material";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
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
    if (changeInCart) {
      openCartDropDown();
      dispatch(setChangeInCart(false));
    }
  }, [changeInCart, dispatch, closeCartDropDown, openCartDropDown]);

  const handleClick = () => {
    dispatch(setPageLoading(true));
    closeCartDropDown();
    router.push("/shop/cart");
  };

  const cartIconClick = () => {
    dispatch(setPageLoading(true));
    closeCartDropDown();
  };

  const viewCartHandler_small = () => {
    dispatch(setPageLoading(true));
    closeCartDropDown();
    router.push("/shop/cart");
  };

  return (
    <Fragment>
      <Box onClick={cartIconClick} onMouseEnter={openCartDropDown}>
        <Link href="/shop/cart">
          <a>
            <LocalMallIcon className={styles.cart_icon} />
          </a>
        </Link>
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
        timeout={{ enter: 500, exit: 500 }}
      >
        <Paper
          onMouseLeave={closeCartDropDown}
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

      {cart.length > 0 && (
        <Modal_Styled
          disableScrollLock={true}
          open={showCart}
          onClose={closeCartDropDown}
          sx={{ display: { xs: "block", sm: "block", md: "none" } }}
          className={styles.cart_slide_modal}
        >
          <Slide
            direction="up"
            in={showCart}
            timeout={{ enter: 500, exit: 500 }}
          >
            <Paper className={styles.cart_slide}>
              <div className={styles.item_container}>
                <div className={styles.item_image_box}>
                  <Image
                    src={cart[cart.length - 1].imageUrl}
                    alt="new-item"
                    width={80}
                    height={110}
                  />
                </div>
                <div className={styles.item_text}>New Item Added To Cart</div>
                <div>
                  <Button variant="outlined" onClick={viewCartHandler_small}>
                    View Cart
                  </Button>
                </div>
              </div>

              <div className={styles.close_icon} onClick={closeCartDropDown}>
                <CancelPresentationSharpIcon />
              </div>
            </Paper>
          </Slide>
        </Modal_Styled>
      )}
    </Fragment>
  );
}

const Modal_Styled = styled(Modal)<ModalProps>(({}) => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
}));

export default memo(CartIcon);
