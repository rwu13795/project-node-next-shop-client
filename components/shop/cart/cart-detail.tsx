import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, Fragment, memo } from "react";
import { useRouter } from "next/router";

import {
  CartItem,
  removeFromCartSession,
  selectChangeInCart,
  selectCurrentUser,
  selectIsLoggedIn,
  selectTotalAmount,
  setChangeInCart,
} from "../../../utils/redux-store/userSlice";
import CartEditModal from "./cart-edit-modal";

// UI //
import { Button, Grid } from "@mui/material";
import SelectQuantity from "../product/product-detail/line-items/quantities";
import styles from "./__cart-detail.module.css";

interface Props {
  cart: CartItem[];
  summaryMode?: boolean;
  cartDropDown?: boolean;
  closeCartDropDown?: () => void;
  viewCart?: () => void;
}

interface SummaryBoxProps {
  cart: CartItem[];
  totalAmount: number;
  preCheckoutHandler: () => void;
  summaryMode?: boolean;
}

function CartDetail({
  cart,
  summaryMode,
  cartDropDown,
  closeCartDropDown,
  viewCart,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  const totalAmount = useSelector(selectTotalAmount);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  const removeItemHandler = (index: number) => {
    dispatch(removeFromCartSession(index));
  };

  const preCheckoutHandler = () => {
    if (closeCartDropDown) closeCartDropDown();

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

  // a pile of shitty styles
  let main = styles.main_grid;
  let left_grid = styles.left_grid;
  let item_container = styles.item_container;
  let image_text_container = styles.image_text_container;
  let imgae_container = styles.imgae_container;
  let text_container = styles.text_container;
  let item_title = styles.item_title;
  let qty_subtotal_grid = styles.qty_subtotal_grid;
  let qty_remove_grid = styles.qty_remove_grid;
  let qty_box = styles.qty_box;
  let remove_box = styles.remove_box;
  let subtotal = styles.subtotal;

  if (cartDropDown) {
    left_grid = styles.left_grid_drop_down;
    item_container = styles.item_container_drop_down;
    image_text_container = styles.image_text_container_drop_down;
    imgae_container = styles.imgae_container_drop_down;
    text_container = styles.text_container_drop_down;
    item_title = styles.item_title_drop_down;
    subtotal = styles.subtotal_drop_down;
  }
  if (summaryMode) {
    item_container = styles.item_container_checkout;
    // image_text_container = styles.image_text_container_drop_down;
    imgae_container = styles.imgae_container_drop_down;
    text_container = styles.text_container_drop_down;
    item_title = styles.item_title_drop_down;
    subtotal = styles.subtotal_drop_down;
    left_grid = styles.left_grid_checkout;
    qty_subtotal_grid = styles.qty_subtotal_grid_checkout;
  }

  return cart.length <= 0 ? (
    <Fragment>
      <div className={styles.no_item_text}>
        There Is No Item In Your Shopping Cart.
      </div>
    </Fragment>
  ) : (
    <Grid container className={main}>
      <Grid item container className={left_grid}>
        {summaryMode && (
          <SummaryBoxMemo
            cart={cart}
            totalAmount={totalAmount}
            preCheckoutHandler={preCheckoutHandler}
            summaryMode={summaryMode}
          />
        )}
        {cart.map((item, index) => {
          return (
            <div key={item.productId} className={item_container}>
              <div className={image_text_container}>
                <div className={imgae_container}>
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    width={cartDropDown || summaryMode ? 120 : 300}
                    height={cartDropDown || summaryMode ? 141 : 332}
                  />
                </div>

                <div className={text_container}>
                  <div className={item_title}>{item.title.toUpperCase()}</div>
                  <div>
                    <div>Color: {item.colorName.toUpperCase()}</div>
                    {cartDropDown && <div>Qty: {item.quantity}</div>}
                    <div>Price: $ {item.price}</div>
                    <div>Size: {item.size.toUpperCase()}</div>
                  </div>
                  {!summaryMode && !cartDropDown && (
                    <CartEditModal
                      category={item.main_cat}
                      productId={item.productId}
                      index={index}
                      editItem={cart[index]}
                    />
                  )}
                </div>
              </div>

              <div className={qty_subtotal_grid}>
                <div>
                  <div className={qty_remove_grid}>
                    <div className={qty_box}>
                      {!cartDropDown && (
                        <SelectQuantity
                          quantity={item.quantity}
                          disabled={item.size === ""}
                          // the totalQty of a specific product was added to the cart also when
                          // user add this product to cart, so that I can map the "SelectQuantity"
                          // in the cartDetail without making request to the server again
                          availableQty={item.availableQty}
                          directChange={true}
                          index={index}
                          inCartDetail={true}
                        />
                      )}
                    </div>
                    <div className={remove_box}>
                      {!cartDropDown && (
                        <Button
                          variant="outlined"
                          color="error"
                          className={styles.remove_button}
                          onClick={() => removeItemHandler(index)}
                        >
                          remove
                        </Button>
                      )}
                    </div>
                  </div>
                  {item.stockError && (
                    <div style={{ color: "red" }}>{item.stockError}</div>
                  )}
                </div>

                <div className={subtotal}>
                  Subtotal: $ {item.quantity * item.price}
                </div>
              </div>
            </div>
          );
        })}
      </Grid>

      {!cartDropDown ? (
        !summaryMode && (
          <SummaryBoxMemo
            cart={cart}
            totalAmount={totalAmount}
            preCheckoutHandler={preCheckoutHandler}
            summaryMode={summaryMode}
          />
        )
      ) : (
        <div className={styles.summary_drop_down}>
          <div className={styles.items_total}>
            <div>
              Total{" "}
              {cart.length > 0
                ? cart
                    .map((item) => item.quantity)
                    .reduce((prev, accum) => prev + accum)
                : 0}
              {` item(s)`}
            </div>
            <div>$ {totalAmount}</div>
          </div>
          <div className={styles.buttons_group_drop_down}>
            <Button
              variant="outlined"
              color="primary"
              className={styles.button_drop_down}
              onClick={viewCart}
            >
              View Cart
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={styles.button_drop_down}
              onClick={preCheckoutHandler}
            >
              Check Out
            </Button>
          </div>
          <div className={styles.close_bag} onClick={closeCartDropDown}>
            CLOSE BAG
          </div>
        </div>
      )}
    </Grid>
  );
}

export default memo(CartDetail);

function SummaryBox({
  cart,
  totalAmount,
  summaryMode,
  preCheckoutHandler,
}: SummaryBoxProps): JSX.Element {
  let summary_container = styles.summary_container_cart;
  let summary_body = styles.summary_body_cart;
  let right_grid = styles.right_grid;
  if (summaryMode) {
    summary_container = styles.summary_container_checkout;
    summary_body = styles.summary_body_checkout;
    right_grid = styles.right_grid_checkout;
  }

  return (
    <Grid className={right_grid}>
      <div className={summary_container}>
        <div className={styles.summary_title}>ORDER SUMMARY</div>
        <div className={summary_body}>
          <div className={styles.items_total}>
            <div>Total Items</div>
            <div>
              {cart.length > 0
                ? cart
                    .map((item) => item.quantity)
                    .reduce((prev, accum) => prev + accum)
                : 0}
              {` item(s)`}
            </div>
          </div>
          <div className={styles.order_total}>
            <div>Order Total</div>
            <div>$ {totalAmount}</div>
          </div>
          {cart.length > 0 && !summaryMode && (
            <Button
              variant="contained"
              color="primary"
              className={styles.checkout_button}
              onClick={preCheckoutHandler}
            >
              Check Out
            </Button>
          )}
        </div>
      </div>
    </Grid>
  );
}
const SummaryBoxMemo = memo(SummaryBox);
