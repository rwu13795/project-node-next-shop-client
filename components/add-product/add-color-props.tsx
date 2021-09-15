import { ChangeEvent, Fragment } from "react";

import { ProductProps } from "../../pages/admin/add-product";
import SelectColor from "./select-color";
import { FieldNames } from "./enums/field-names-enum";
import { Errors } from "../../util/react-hooks/use-upload";
import { AddImage } from "./add-image";

interface Props {
  propsChangeHandler: (e: ChangeEvent<HTMLInputElement>, index: number) => void;
  removeColorHandler: (index: number) => void;
  removeImageHandler: (index: number, imageIndex: number) => void;
  productProp: ProductProps;
  listIndex: number;
  propError: Errors | null | undefined;
}

const AddColorsProps = (props: Props): JSX.Element => {
  const {
    propsChangeHandler,
    removeColorHandler,
    removeImageHandler,
    productProp,
    listIndex,
    propError,
  } = props;

  const sizesArray = [FieldNames.small, FieldNames.medium, FieldNames.large];

  return (
    <div>
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
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  propsChangeHandler(e, listIndex)
                }
              />
            </Fragment>
          );
        })}
      </div>

      <AddImage
        removeImageHandler={removeImageHandler}
        propsChangeHandler={propsChangeHandler}
        productProp={productProp}
        listIndex={listIndex}
        propError={propError}
      />

      <div>
        <button onClick={() => removeColorHandler(listIndex)}>
          Remove this color
        </button>
      </div>
    </div>
  );
};

export default AddColorsProps;
