import { NextPage } from "next";
import { useDispatch } from "react-redux";
import { clearCheckoutInfo } from "../../utils/redux-store/shopSlice";
import { clearCartSession } from "../../utils/redux-store/userSlice";

const PaymentSuccessful: NextPage = ({}) => {
  const dispatch = useDispatch();
  dispatch(clearCartSession());
  dispatch(clearCheckoutInfo());

  return <h1>Thank you for the purchase!</h1>;
};

export default PaymentSuccessful;
