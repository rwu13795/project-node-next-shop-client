import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { inputNames } from "../../../utils/enums-types/input-names";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { onChangeErrorCheck } from "../../../utils/helper-functions/input-error-check";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function AddTitle(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo, propError, setErrors } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  return (
    <div>
      <label>Title</label>
      <input
        name={inputNames.title}
        type="text"
        value={productInfo.title}
        onChange={onChangeHandler}
        // onBlur={onBlurHandler}
        // onFocus={onFocusHandler}
        // style={styles}
      ></input>
      <div></div>

      <span>{propError[inputNames.title]}</span>
    </div>
  );
}
