import { ChangeEvent, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectDesc_adminProduct,
  selectUploadError_byInputName,
  setDesc_adminProduct,
} from "../../../utils/redux-store/adminProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";

// UI //
import {
  FormHelperText,
  FormControl,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import styles from "./__styles.module.css";
import { sxMUI } from "./__styles-MUI";

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddDescription({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const description = useSelector(selectDesc_adminProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.desc)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.desc));
    setFormHasError(false);
    dispatch(setDesc_adminProduct(value));
  };

  const error = uploadError !== "";

  return (
    <FormControl error={error} className={styles.desc_box}>
      <InputLabel htmlFor="outlined-price">Description</InputLabel>
      <OutlinedInput
        label="Description"
        multiline
        rows={7}
        name={inputNames.desc}
        value={description}
        onChange={onChangeHandler}
        error={error}
        className={styles.input_box_shadow}
      />
      <FormHelperText sx={sxMUI.input_error}>{uploadError}</FormHelperText>
    </FormControl>
  );
}

export default memo(AddDescription);
