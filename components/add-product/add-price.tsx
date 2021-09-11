import { SetStateAction } from "react";

interface Props {
  setPrice: (value: SetStateAction<number>) => void;
  price: number;
}

const AddPrice = (props: Props): JSX.Element => {
  const { price, setPrice } = props;

  return (
    <div>
      <label htmlFor="price">Price: $</label>
      <input
        name="price"
        id="price"
        type="number"
        value={price}
        min="0"
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      ></input>
    </div>
  );
};

export default AddPrice;
