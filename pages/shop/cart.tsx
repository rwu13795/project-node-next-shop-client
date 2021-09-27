import { NextPage } from "next";
import Image from "next/image";
import { useSelector } from "react-redux";

import { selectCart } from "../../utils/redux-store/userSlice";
import EditDetailModal from "../../components/shop/edit-detail-modal";

const Cart: NextPage = ({}) => {
  const cart = useSelector(selectCart);

  return (
    <main>
      <h2>Shopping Cart</h2>
      {cart.map((item, index) => {
        return (
          <div key={item.productId + item.size}>
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={150}
              height={150}
            />
            <div>{item.title}</div>
            <div>${item.price}</div>
            <div>size: {item.size}</div>
            <div>qty: {item.quantity}</div>
            <EditDetailModal
              category={item.main_cat}
              productId={item.productId}
              index={index}
            />
            <hr />
          </div>
        );
      })}
    </main>
  );
};

export default Cart;
