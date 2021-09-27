import Image from "next/image";

import { CartItem } from "../../utils/redux-store/userSlice";
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
            <hr />
          </div>
        );
      })}
    </div>
  );
}
