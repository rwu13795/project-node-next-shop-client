import { ChangeEvent, Dispatch, useState } from "react";
import Image from "next/image";

import { inputNames } from "../../../utils/enums-types/input-names";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import {
  ActionType,
  ReducerColorProps,
} from "../../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../../utils/enums-types/product-reducer-actions";

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

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  editMode: boolean;
  propError: Errors;
}

export default function AddImage(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch, editMode, propError } = props;

  const [editImage, setEditImage] = useState<boolean>(false);

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

  const removeImageHandler = (imageIndex: number) => {
    // clear the image input file
    let input = document.getElementById(
      `add-more-image-${listIndex}`
    ) as HTMLInputElement;
    if (input) input.value = "";

    dispatch({
      type: Actions.removeImage,
      payload: { listIndex, imageIndex, editMode },
    });
  };

  const editImageHandler = () => {
    setEditImage((prev) => !prev);
  };

  return (
    <Grid item container className={styles.form_grid_center}>
      {colorProps.imageFiles.length > 0 && (
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

      {colorProps.imageFiles.map((file, imageIndex) => {
        return (
          <Box key={imageIndex} className={styles.image_box}>
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
                  <Box>
                    <InputLabel
                      htmlFor={`relace-image-${listIndex}-${imageIndex}`}
                    >
                      <ChangeCircleIcon
                        className={styles.image_button}
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
                  </Box>
                </Tooltip>
                <Tooltip title="Remove">
                  <Box onClick={() => removeImageHandler(imageIndex)}>
                    <CancelIcon
                      className={styles.image_button}
                      style={{ color: "#f44336" }}
                    />
                  </Box>
                </Tooltip>
              </Grid>
            )}

            <Image
              src={typeof file === "string" ? file : URL.createObjectURL(file)}
              alt="selected image"
              width={180}
              height={180}
            />
            {/* <Box className={styles.image_file_text}>
                {file}
                {typeof file !== "string" && file.name}
              </Box> */}
          </Box>
        );
      })}
      <Box className={styles.image_box}>
        <Grid
          container
          className={styles.form_grid_center}
          flexDirection="column"
        >
          <InputLabel htmlFor={`add-more-image-${listIndex}`}>
            <AddBoxIcon className={styles.image_button_large} />
          </InputLabel>
          <input
            type="file"
            accept="image/jpeg"
            name={inputNames.addImage}
            id={`add-more-image-${listIndex}`}
            style={{ display: "none" }}
            onChange={addImageHandler}
          />
          <Box className={styles.image_button_text}>Add Images</Box>
        </Grid>
      </Box>

      {colorProps.imageCount < 1 && (
        <FormHelperText className={styles.input_error}>
          {propError[inputNames.imagesCount]}
        </FormHelperText>
      )}
    </Grid>
  );
}
