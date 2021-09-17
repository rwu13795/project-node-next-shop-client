import { SetStateAction, Dispatch } from "react";

import { FieldNames } from "../../util/enums/input-field-names-enum";
import { InfoChangeHandler, ProductInfo } from "../../pages/admin/add-product";

interface Props {
  infoChangeHandler: InfoChangeHandler;
  productInfo: ProductInfo;
}

export default function AddPrice(props: Props): JSX.Element {
  const { productInfo, infoChangeHandler } = props;

  return (
    <div>
      <label htmlFor="price">Price: $</label>
      <input
        name={FieldNames.price}
        type="number"
        value={productInfo.price}
        min="0"
        onChange={(e) =>
          infoChangeHandler(parseFloat(e.target.value), e.target.name)
        }
      ></input>
    </div>
  );
}
