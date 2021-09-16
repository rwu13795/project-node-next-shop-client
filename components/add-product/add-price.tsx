import { SetStateAction } from "react";

import { FieldNames } from "../../util/enums/input-field-names-enum";

interface Props {
  setPrice: (value: SetStateAction<number>) => void;
  price: number;
}

export default function AddPrice(props: Props): JSX.Element {
  const { price, setPrice } = props;

  return (
    <div>
      <label htmlFor="price">Price: $</label>
      <input
        name={FieldNames.price}
        type="number"
        value={price}
        min="0"
        onChange={(e) => setPrice(parseFloat(e.target.value))}
      ></input>
    </div>
  );
}
