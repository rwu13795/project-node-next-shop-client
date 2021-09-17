import { FieldNames } from "../../util/enums/input-field-names";
import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/add-product-upload";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
  propError: Errors | null | undefined;
}

export default function AddDescription(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo, propError } = props;

  return (
    <div>
      <label>Description: </label>
      <textarea
        name={FieldNames.desc}
        rows={6}
        value={productInfo.description}
        onChange={dispatchAddInfo}
      ></textarea>
      {propError && propError[FieldNames.desc] && (
        <div>{propError[FieldNames.desc]}</div>
      )}
    </div>
  );
}
