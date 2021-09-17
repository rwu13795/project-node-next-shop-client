import { FieldNames } from "../../util/enums/input-field-names";
import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../pages/admin/add-product";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
}

export default function AddDescription(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo } = props;

  return (
    <div>
      <label>Description: </label>
      <textarea
        name={FieldNames.desc}
        rows={6}
        value={productInfo.description}
        onChange={dispatchAddInfo}
      ></textarea>
      {/* {errors && errors[FieldNames.desc] && (
          <div>{errors[FieldNames.desc]}</div>
        )} */}
    </div>
  );
}
