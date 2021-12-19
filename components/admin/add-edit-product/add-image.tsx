import { ChangeEvent, useState, memo } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  addImage_adminProduct,
  removeImage_adminProduct,
  replaceImage_adminProduct,
  selectImageUrls_byListIndex,
  selectUploadError_byInputName,
} from "../../../utils/redux-store/adminProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";

// UI //
import {
  InputLabel,
  Grid,
  Box,
  Tooltip,
  Button,
  FormHelperText,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CancelIcon from "@mui/icons-material/Cancel";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import styles from "./__styles.module.css";
import { sxMUI } from "./__styles-MUI";

interface Props {
  listIndex: number;
  editMode: boolean;
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

// NOTE //
// Beacause the image file is a non-serializable value, Redux cannot compare the image
// file's current value  with its previous value. So it means any component that consume
// the value of the image file (such as this "addImage" component) will be re-rendered
// every single time when there is change in the "colorProps" state (such as changing Qty
// in the "addSizeQty")

// So, in the Store first whenever the a image file is added,
// I have to convert the image file into a Url, and push this Url to an arrry,
// and then use selector to select this array by the listIndex
// by doing so, Redux is able compare the values of the urlArray, and won't trigger
// the re-rendering in "addImage" if the url values are the same
function AddImage({
  listIndex,
  editMode,
  setFormHasError,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const imageUrls = useSelector((state: RootState) =>
    selectImageUrls_byListIndex(state, listIndex)
  );
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.imagesCount)
  );

  const [editImage, setEditImage] = useState<boolean>(false);

  const addImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newImagesList = e.target.files as FileList;
    setFormHasError(false);
    dispatch(addImage_adminProduct({ listIndex, newImagesList }));
  };

  const replaceImageHandler = (
    e: ChangeEvent<HTMLInputElement>,
    imageIndex: number
  ) => {
    const newImageFile = (e.target.files as FileList)[0];
    dispatch(
      replaceImage_adminProduct({
        newImageFile,
        listIndex,
        imageIndex,
        editMode,
      })
    );
  };

  const removeImageHandler = (imageIndex: number) => {
    // clear the image input file
    let input = document.getElementById(
      `add-more-image-${listIndex}`
    ) as HTMLInputElement;
    if (input) input.value = "";

    dispatch(removeImage_adminProduct({ listIndex, imageIndex, editMode }));
  };

  const editImageHandler = () => {
    setEditImage((prev) => !prev);
  };

  return (
    <Grid item container className={styles.form_grid_center}>
      {imageUrls.length > 0 && (
        <div style={{ marginRight: "1rem" }}>
          {editImage ? (
            <Button color="error" variant="outlined" onClick={editImageHandler}>
              Cancel
            </Button>
          ) : (
            <Button variant="outlined" onClick={editImageHandler}>
              Edit
            </Button>
          )}
        </div>
      )}

      {imageUrls.map((url, imageIndex) => {
        return (
          <div key={imageIndex} className={styles.image_box}>
            {/* have to change the "htmlfor" and "id" dynamically, otherwise the first label/input will
                always be triggered since all the labels have the same "htmlFor" and "id"  */}
            {editImage && (
              <Grid
                container
                flexDirection="row"
                wrap="nowrap"
                justifyContent="space-evenly"
                alignItems="baseline"
              >
                {/* Note: opacity is used to hide the file input instead of visibility: hidden or 
                display: none, because assistive technology interprets the latter two styles to mean 
                the file input isn't interactive. */}
                <Tooltip title="Change">
                  <div>
                    <InputLabel
                      htmlFor={`relace-image-${listIndex}-${imageIndex}`}
                    >
                      <ChangeCircleIcon
                        className={styles.image_button}
                        sx={sxMUI.image_button}
                        style={{ color: "#008ab4 " }}
                      />
                    </InputLabel>
                    <input
                      type="file"
                      accept="image/jpeg"
                      id={`relace-image-${listIndex}-${imageIndex}`}
                      name={inputNames.replaceImage}
                      style={{ display: "none" }}
                      onChange={(e) => replaceImageHandler(e, imageIndex)}
                    />
                  </div>
                </Tooltip>
                <Tooltip title="Remove">
                  <div onClick={() => removeImageHandler(imageIndex)}>
                    <CancelIcon
                      className={styles.image_button}
                      sx={sxMUI.image_button}
                      style={{ color: "#f44336" }}
                    />
                  </div>
                </Tooltip>
              </Grid>
            )}

            <Image src={url} alt="selected-image" width={180} height={180} />
            {/* <Box className={styles.image_file_text}>
                {file}
                {typeof file !== "string" && file.name}
              </Box> */}
          </div>
        );
      })}
      <div className={styles.add_image_box}>
        <Grid
          container
          className={styles.form_grid_center}
          flexDirection="column"
        >
          <InputLabel htmlFor={`add-more-image-${listIndex}`}>
            <AddBoxIcon
              className={styles.image_button_large}
              sx={sxMUI.image_button_large}
            />
          </InputLabel>
          <input
            multiple
            type="file"
            accept="image/jpeg"
            name={inputNames.addImage}
            id={`add-more-image-${listIndex}`}
            style={{ display: "none" }}
            onChange={addImageHandler}
          />
          <div className={styles.image_button_text}>Add Images</div>
        </Grid>
      </div>

      {imageUrls.length < 1 && (
        <FormHelperText sx={sxMUI.input_error}>{uploadError}</FormHelperText>
      )}
    </Grid>
  );
}

export default memo(AddImage);
