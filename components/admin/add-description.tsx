import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { inputNames } from "../../util/enums-types/input-names";
import { ReducerProductInfo } from "../../util/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../pages/admin/add-product";
import {
  Errors,
  onChangeErrorCheck,
} from "../../util/react-hooks/input-error-check";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function AddDescription(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo, propError, setErrors } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  return (
    <div>
      <label>Description: </label>
      <textarea
        name={inputNames.desc}
        rows={6}
        value={productInfo.description}
        onChange={onChangeHandler}
      ></textarea>

      <span>{propError[inputNames.desc]}</span>
    </div>
  );
}
