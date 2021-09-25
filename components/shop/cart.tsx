import { useSelector } from "react-redux";
import { selectCart } from "../../store/authSlice";

export default function Cart(): JSX.Element {
  const cart = useSelector(selectCart);

  return <div>Cart {cart.length}</div>;
}
