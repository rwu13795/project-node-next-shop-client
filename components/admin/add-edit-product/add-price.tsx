import { inputNames } from "../../../utils/enums-types/input-names";
import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
}
export default function AddPrice(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo } = props;

  return (
    <div>
      <label htmlFor="price">Price: $</label>
      <input
        name={inputNames.price}
        type="number"
        value={productInfo.price}
        min={0}
        onChange={dispatchAddInfo}
      ></input>
    </div>
  );
}
