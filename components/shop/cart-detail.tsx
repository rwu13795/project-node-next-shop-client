import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import {
  CartItem,
  removeFromCartSession,
  selectChangeInCart,
  selectTotalAmount,
  setChangeInCart,
} from "../../utils/redux-store/userSlice";
import EditDetailModal from "../../components/shop/edit-detail-modal";
import SelectQuantity from "./select-quantity";

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

  if (cart.length <= 0) {
    return <h1>There Is No Item In Your Shopping Cart.</h1>;
  }

  return (
    <div>
      {cart.map((item, index) => {
        console.log(item.stockErrors);
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
              <EditDetailModal
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
            {item.stockErrors?.notEnough && (
              <div style={{ color: "red" }}>{item.stockErrors.notEnough}</div>
            )}
            {item.stockErrors?.outOfStock && (
              <div style={{ color: "red" }}>{item.stockErrors.outOfStock}</div>
            )}
            <hr />
          </div>
        );
      })}
      <h3>Total: ${totalAmount}</h3>
    </div>
  );
}
