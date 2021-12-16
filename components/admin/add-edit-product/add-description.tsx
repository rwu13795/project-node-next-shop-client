import { ChangeEvent, Dispatch, SetStateAction, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectDesc_addProduct,
  selectUploadError_byInputName,
  setDesc_addProduct,
} from "../../../utils/redux-store/addProductSlice";
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

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddDescription({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const description = useSelector(selectDesc_addProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.desc)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.desc));
    setFormHasError(false);
    dispatch(setDesc_addProduct(value));
  };

  const error = uploadError !== "";

  console.log("re-render in add DESC");

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
      <FormHelperText className={styles.input_error}>
        {uploadError}
      </FormHelperText>
    </FormControl>
  );
}

export default memo(AddDescription);
