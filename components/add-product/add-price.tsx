import { inputNames } from "../../util/enums/input-names";
import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../pages/admin/add-product";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
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
