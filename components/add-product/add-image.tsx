import { Fragment, ChangeEvent, MouseEvent } from "react";
import Image from "next/image";

import {
  ProductProps,
  PropsChangeHandler,
} from "../../pages/admin/add-product";
import { FieldNames } from "../../util/enums/input-field-names-enum";
import { Errors } from "../../util/react-hooks/use-upload";
import image from "next/image";

interface Props {
  propsChangeHandler: PropsChangeHandler;
  productProp: ProductProps;
  listIndex: number;
  propError: Errors | null | undefined;
}

export default function AddImage(props: Props): JSX.Element {
  const { propsChangeHandler, productProp, listIndex, propError } = props;

  const imageChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    imageIndex?: number
  ) => {
    const newImage = (e.target.files as FileList)[0];
    const inputField = e.target.name;
    propsChangeHandler("", inputField, listIndex, newImage, imageIndex);
  };

  const removeImageHandler = (
    e: MouseEvent<HTMLButtonElement>,
    imageIndex: number
  ) => {
    const inputField = e.currentTarget.name;
    propsChangeHandler("", inputField, listIndex, undefined, imageIndex);
  };

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
                  name={FieldNames.removeImage}
                  onClick={(e) => removeImageHandler(e, imageIndex)}
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
                  name={FieldNames.replaceImage}
                  style={{ opacity: 0, width: "1px" }}
                  onChange={(e) => imageChangeHandler(e, imageIndex)}
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
          // htmlFor="upload-image"
          // style={{
          //   minWidth: "4rem",
          //   height: "1.8rem",
          //   overflow: "hidden",
          //   border: "black solid 1px",
          //   backgroundColor: "white",
          //   cursor: "pointer",
          // }}
          >
            Add more images
          </label>
          <input
            type="file"
            accept="image/jpeg"
            name={FieldNames.addImage}
            id="upload-image"
            // style={{ opacity: 0, width: "1px" }}
            onChange={imageChangeHandler}
          />
        </div>
        {propError && productProp.imagesCount < 1 && (
          <div>{propError[FieldNames.imagesCount]}</div>
        )}
      </div>
    </Fragment>
  );
}
