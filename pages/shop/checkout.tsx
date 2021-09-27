import { GetStaticPropsContext, NextPage } from "next";
import { useSelector } from "react-redux";
import { useState } from "react";

import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  selectCart,
  selectIsLoggedIn,
} from "../../utils/redux-store/userSlice";
import CheckoutForm from "../../components/shop/checkout-form";
import CartDetail from "../../components/shop/cart-detail";

const inputFieldsArray = [
  inputNames.first_name,
  inputNames.last_name,
  inputNames.address_1,
  inputNames.address_2,
  inputNames.state,
  inputNames.city,
  inputNames.zip_code,
  inputNames.phone,
];

const CheckoutPage: NextPage = ({}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const cart = useSelector(selectCart);
  const [total] = useState<number>(() => {
    let total = 0;
    for (let item of cart) {
      total = item.price * item.quantity + total;
    }
    return total;
  });

  return (
    <main>
      <h1>Chech Out Page</h1>
      <CheckoutForm
        inputType={inputTypes.addressInfo}
        inputFields={inputFieldsArray}
      />
      <hr></hr>
      <div>Order Summary</div>
      <CartDetail cart={cart} summaryMode={true} />
      <h3>Total: ${total}</h3>
    </main>
  );
};

export default CheckoutPage;

export async function getServerSideProps(context: GetStaticPropsContext) {
  const userId = context.params?.userId as string;

  if (!userId) {
    return { props: {} };
  }

  return { props: {} };
}
