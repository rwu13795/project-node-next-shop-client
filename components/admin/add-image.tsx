import { Fragment, ChangeEvent, MouseEvent, Dispatch } from "react";
import Image from "next/image";

import { inputNames } from "../../utils/enums-types/input-names";
import { Errors } from "../../utils/react-hooks/input-error-check";
import {
  ActionType,
  ReducerColorProps,
} from "../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../utils/enums-types/product-reducer-actions";

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  editMode: boolean;
  propError: Errors;
}

export default function AddImage(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch, editMode, propError } = props;

  const addImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newImage = (e.target.files as FileList)[0];
    dispatch({ type: Actions.addImage, payload: { listIndex, newImage } });
  };

  const replaceImageHandler = (
    e: ChangeEvent<HTMLInputElement>,
    imageIndex: number
  ) => {
    const newImage = (e.target.files as FileList)[0];
    dispatch({
      type: Actions.replaceImage,
      payload: { listIndex, newImage, imageIndex, editMode },
    });
  };

  return (
    <Fragment>
      <div>
        <label>Upload Image: </label>
      </div>
      <div>
        {colorProps.imageFiles.length > 0 &&
          colorProps.imageFiles.map((file, imageIndex) => {
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
                  name={inputNames.removeImage}
                  onClick={() =>
                    dispatch({
                      type: Actions.removeImage,
                      payload: { listIndex, imageIndex, editMode },
                    })
                  }
                >
                  X
                </button>
                {/* have to change the "htmlfor" and "id" dynamically, otherwise the first label/input will
                always be triggered since all the labels have the same "htmlFor" and "id"  */}
                <label
                  htmlFor={`relace-image-${listIndex}-${imageIndex}`}
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
                  id={`relace-image-${listIndex}-${imageIndex}`}
                  name={inputNames.replaceImage}
                  style={{ opacity: 0, width: "1px" }}
                  onChange={(e) => replaceImageHandler(e, imageIndex)}
                />

                <Image
                  src={
                    typeof file === "string" ? file : URL.createObjectURL(file)
                  }
                  alt="selected image"
                  width={150}
                  height={150}
                />
                <div style={{ overflow: "hidden", maxHeight: "1.5rem" }}>
                  {typeof file !== "string" && file.name}
                </div>
              </div>
            );
          })}
        <div>
          <label
            htmlFor={`add-more-image-${listIndex}`}
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
            name={inputNames.addImage}
            id={`add-more-image-${listIndex}`}
            style={{ opacity: 0, width: "1px" }}
            onChange={addImageHandler}
          />
        </div>

        {colorProps.imageCount < 1 && (
          <span>{propError[inputNames.imagesCount]}</span>
        )}
      </div>
    </Fragment>
  );
}