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

  // const [total, setTotal] = useState<number>(() => {
  //   let total = 0;
  //   for (let item of cart) {
  //     total = item.price * item.quantity + total;
  //   }
  //   console.log(total);
  //   return total;
  // });

  // useEffect(() => {
  //   if (changeInCart) {
  //     let total = 0;
  //     for (let item of cart) {
  //       total = item.price * item.quantity + total;
  //     }
  //     setTotal(total);
  //   }
  // }, [changeInCart, cart, dispatch]);

  return (
    <div>
      {cart.map((item, index) => {
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
                quantity={item.quantity.toString()}
                // the totalQty of a specific product was added to the cart also when
                // user add this product to cart, so that I can map the "SelectQuantity"
                // in the cartDetail without making request to the server again
                totalQty={item.totalQty}
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
            <hr />
          </div>
        );
      })}
      <h3>Total: ${totalAmount}</h3>
    </div>
  );
}
