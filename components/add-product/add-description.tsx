import { Dispatch, SetStateAction } from "react";

import { FieldNames } from "../../util/enums/input-field-names-enum";
import { InfoChangeHandler, ProductInfo } from "../../pages/admin/add-product";

interface Props {
  infoChangeHandler: InfoChangeHandler;
  productInfo: ProductInfo;
}

export default function AddDescription(props: Props): JSX.Element {
  const { productInfo, infoChangeHandler } = props;

  return (
    <div>
      <label>Description: </label>
      <textarea
        name={FieldNames.desc}
        rows={6}
        value={productInfo.description}
        onChange={(e) => infoChangeHandler(e.target.value, e.target.name)}
      ></textarea>
    </div>
  );
}
