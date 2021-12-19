import { memo, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectTitle_adminProduct,
  selectUploadError_byInputName,
  setTitle_adminProduct,
} from "../../../utils/redux-store/adminProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";

// UI //
import {
  FormControl,
  FormHelperText,
  Grid,
  OutlinedInput,
  InputLabel,
  useMediaQuery,
} from "@mui/material";
import styles from "./__styles.module.css";
import { sxMUI } from "./__styles-MUI";

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddTitle({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const title = useSelector(selectTitle_adminProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.title)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.title));
    setFormHasError(false);
    dispatch(setTitle_adminProduct(value));
  };

  const isSmall = useMediaQuery("(max-width: 550px)");

  const error = uploadError !== "";

  return (
    <Grid item>
      <FormControl
        error={error}
        sx={isSmall ? sxMUI.form_control_small : sxMUI.form_control}
      >
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
        <FormHelperText sx={sxMUI.input_error}>{uploadError}</FormHelperText>
      </FormControl>
    </Grid>
  );
}

export default memo(AddTitle);
