import { ChangeEvent, Fragment, MouseEvent } from "react";
import Image from "next/image";

import {
  ProductProps,
  PropsChangeHandler,
} from "../../pages/admin/add-product";
import SelectColor from "./select-color";
import { FieldNames } from "../../util/enums/input-field-names-enum";
import { Errors } from "../../util/react-hooks/use-upload";
import AddImage from "./add-image";

interface Props {
  propsChangeHandler: PropsChangeHandler;
  productProp: ProductProps;
  listIndex: number;
  propError: Errors | null | undefined;
}

export default function AddColorsProps(props: Props): JSX.Element {
  const { propsChangeHandler, productProp, listIndex, propError } = props;

  const sizesArray = [FieldNames.small, FieldNames.medium, FieldNames.large];

  const sizesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const sizeNum = e.target.value;
    const inputField = e.target.name;
    console.log("sizes", listIndex);
    propsChangeHandler(sizeNum, inputField, listIndex);
  };

  const removeColorHandler = (e: MouseEvent<HTMLButtonElement>) => {
    const inputField = e.currentTarget.name;
    propsChangeHandler("", inputField, listIndex);
  };

  return (
    <Fragment>
      <SelectColor
        productProp={productProp}
        listIndex={listIndex}
        propsChangeHandler={propsChangeHandler}
        propError={propError}
      />

      <div>
        <label>Sizes: </label>
        {sizesArray.map((size) => {
          return (
            <Fragment key={size}>
              <label>{size}</label>
              <input
                required
                placeholder={"0"}
                type="number"
                min={0}
                name={size}
                value={productProp.sizes[size]}
                onChange={sizesChangeHandler}
              />
            </Fragment>
          );
        })}
      </div>
      <AddImage
        propsChangeHandler={propsChangeHandler}
        productProp={productProp}
        listIndex={listIndex}
        propError={propError}
      />
      <div>
        <button name={FieldNames.removeColor} onClick={removeColorHandler}>
          Remove this color
        </button>
      </div>
    </Fragment>
  );
}
