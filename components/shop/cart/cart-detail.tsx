import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, Fragment } from "react";

import {
  CartItem,
  removeFromCartSession,
  selectChangeInCart,
  selectTotalAmount,
  setChangeInCart,
} from "../../../utils/redux-store/userSlice";
import CartEditModal from "./cart-edit-modal";
import SelectQuantity from "../product/select-quantity";

interface Props {
  cart: CartItem[];
  summaryMode?: boolean;
  cartDropDown?: boolean;
}

export default function CartDetail({
  cart,
  summaryMode,
  cartDropDown,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const totalAmount = useSelector(selectTotalAmount);

  return cart.length <= 0 ? (
    <Fragment>
      <div>There Is No Item In Your Shopping Cart.</div>
    </Fragment>
  ) : (
    <Fragment>
      {cart.map((item, index) => {
        console.log(item.stockError);
        return (
          <div key={item.productId + item.size + item.colorName}>
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={cartDropDown ? 75 : 150}
              height={cartDropDown ? 75 : 150}
            />
            <div>{item.title}</div>
            <div>{item.colorName}</div>
            <div>${item.price}</div>
            <div>size: {item.size}</div>
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
              />
            )}
            <div>qty: {item.quantity}</div>
            <div>Subtotal: ${item.quantity * item.price}</div>
            {!summaryMode && (
              <CartEditModal
                category={item.main_cat}
                productId={item.productId}
                index={index}
                editItem={cart[index]}
              />
            )}
            {!cartDropDown && (
              <button
                onClick={() => {
                  dispatch(removeFromCartSession(index));
                }}
              >
                remove
              </button>
            )}
            {item.stockError && (
              <div style={{ color: "red" }}>{item.stockError}</div>
            )}
            <hr />
          </div>
        );
      })}
      <h3>Total: ${totalAmount}</h3>
    </Fragment>
  );
}
