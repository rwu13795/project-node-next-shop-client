import { Fragment, ChangeEvent } from "react";
import Image from "next/image";

import { ProductProps } from "../../pages/admin/add-product";
import { FieldNames } from "./enums/field-names-enum";
import { Errors } from "../../util/react-hooks/use-upload";

interface Props {
  propsChangeHandler: (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    colorName?: string,
    imageIndex?: number
  ) => void;
  removeImageHandler: (index: number, imageIndex: number) => void;
  productProp: ProductProps;
  listIndex: number;
  propError: Errors | null | undefined;
}

export const AddImage = (props: Props) => {
  const {
    propsChangeHandler,
    removeImageHandler,
    productProp,
    listIndex,
    propError,
  } = props;

  return (
    <Fragment>
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
                  }}
                  onClick={() => removeImageHandler(listIndex, imageIndex)}
                >
                  X
                </button>
                {/* have to change the "htmlfor" and "id" dynamically, otherwise the first label/input will
                always be triggered since all the labels have the same "htmlFor" and "id"  */}
                <label
                  htmlFor={`relace-image-${imageIndex}`}
                  style={{
                    width: "2rem",
                    height: "2rem",
                    overflow: "hidden",
                    position: "absolute",
                    zIndex: 9,
                    left: "30%",
                    backgroundColor: "white",
                    cursor: "pointer",
                  }}
                >
                  replace
                </label>
                {/* Note: opacity is used to hide the file input instead of visibility: hidden or 
                display: none, because assistive technology interprets the latter two styles to mean 
                the file input isn't interactive. */}
                <input
                  type="file"
                  accept="image/jpeg"
                  id={`relace-image-${imageIndex}`}
                  name="relace-image"
                  style={{ opacity: 0, width: "1px" }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    propsChangeHandler(e, listIndex, undefined, imageIndex)
                  }
                />

                <Image
                  // src==" if file instance of File ? "ObjectUR"  : "imageUrl"
                  src={URL.createObjectURL(file)}
                  alt="selected image"
                  width={150}
                  height={150}
                />
                <div style={{ overflow: "hidden", maxHeight: "1.5rem" }}>
                  {file.name}
                </div>
              </div>
            );
          })}
        <div>
          <label
            htmlFor="upload-image"
            style={{
              minWidth: "4rem",
              height: "1.8rem",
              overflow: "hidden",
              border: "black solid 1px",
              backgroundColor: "white",
              cursor: "pointer",
            }}
          >
            Add more images
          </label>
          <input
            type="file"
            accept="image/jpeg"
            name="image"
            id="upload-image"
            style={{ opacity: 0, width: "1px" }}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              propsChangeHandler(e, listIndex)
            }
          />
        </div>
        {propError && productProp.imagesCount < 1 && (
          <div>{propError[FieldNames.imagesCount]}</div>
        )}
      </div>
    </Fragment>
  );
};
