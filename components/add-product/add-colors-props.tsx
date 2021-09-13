import { ChangeEvent, SetStateAction, Fragment } from "react";
import Image from "next/image";

import { ProductProps } from "../../pages/admin/add-product";
import SelectColor from "./select-color";
import { FieldTypes } from "./field-types";
import { Errors } from "../../util/react-hooks/use-upload";

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
    productProp,
    listIndex,
    propError,
    propsChangeHandler,
    removeColorHandler,
    removeImageHandler,
  } = props;

  const sizesArray = [FieldTypes.small, FieldTypes.medium, FieldTypes.large];

  return (
    <div>
      {/* <div>
        <label>Colors:</label>
        <input
          required
          type="text"
          name="color"
          value={productProp.color}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            propsChangeHandler(e, listIndex)
          }
        />
      </div> */}
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
      <div>
        <label>Upload Image: </label>
      </div>
      <div>
        {productProp.imagesFiles.length > 0 &&
          productProp.imagesFiles.map((file, imageIndex) => {
            return (
              <div
                key={imageIndex}
                style={{
                  height: "100%",
                  width: "155px",
                  position: "relative",
                  border: "red 2px solid",
                  display: "inline-block",
                }}
              >
                <button
                  style={{
                    position: "absolute",
                    zIndex: 9,
                    right: "5%",
                    cursor: "pointer",
                  }}
                  onClick={() => removeImageHandler(listIndex, imageIndex)}
                >
                  X
                </button>
                <Image
                  src={URL.createObjectURL(file)}
                  alt="selected image"
                  width={150}
                  height={150}
                />
                <div>{file.name}</div>
              </div>
            );
          })}
        <div>
          <input
            type="file"
            accept="image/jpeg"
            name="image"
            id="image"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              propsChangeHandler(e, listIndex)
            }
          />
        </div>
        {propError && productProp.imagesCount < 1 && (
          <div>{propError[FieldTypes.imagesCount]}</div>
        )}
      </div>

      <div>
        <button onClick={() => removeColorHandler(listIndex)}>
          Remove this color
        </button>
      </div>
    </div>
  );
};

export default AddColorsProps;
