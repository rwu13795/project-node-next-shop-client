import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { inputNames } from "../../util/enums/input-names";
import { AddInfoEvents } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/add-product-upload";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
  propError: Errors | null | undefined;
}

export default function AddTitle(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo, propError } = props;

  return (
    <div>
      <label>Title</label>
      <input
        name={inputNames.title}
        type="text"
        value={productInfo.title}
        onChange={dispatchAddInfo}
        // onBlur={onBlurHandler}
        // onFocus={onFocusHandler}
        // style={styles}
      ></input>
      {propError && propError[inputNames.title] && (
        <div>{propError[inputNames.title]}</div>
      )}
    </div>
  );
}
