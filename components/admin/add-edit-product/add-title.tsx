import { memo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectTitle_addProduct,
  selectUploadError_byInputName,
  setTitle_addProduct,
} from "../../../utils/redux-store/addProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddTitle({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const title = useSelector(selectTitle_addProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.title)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.title));
    setFormHasError(false);
    dispatch(setTitle_addProduct(value));
  };

  const error = uploadError !== "";

  console.log("re-render in add title");

  return (
    <Grid item>
      <FormControl error={error} className={styles.form_control}>
        <InputLabel htmlFor="outlined-title">Title</InputLabel>
        <OutlinedInput
          id="outlined-title"
          name={inputNames.title}
          type="text"
          value={title}
          onChange={onChangeHandler}
          label="Title"
          error={error}
          className={styles.input_box_shadow}
        />
        <FormHelperText className={styles.input_error}>
          {uploadError}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
}

export default memo(AddTitle);
