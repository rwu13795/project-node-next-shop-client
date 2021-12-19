import { ChangeEvent, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectUploadError_byInputName,
  setSizeQty_adminProduct,
} from "../../../utils/redux-store/adminProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";
import { capitalize } from "../../../utils/helper-functions/capitalize-first-letter";

// UI //
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  sizesList: { [name: string]: number };
  listIndex: number;
  size: string;
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddSizeQuantity({
  sizesList,
  listIndex,
  size,
  setFormHasError,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.size)
  );

  const sizesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: size, value: qty } = e.currentTarget;
    dispatch(setSizeQty_adminProduct({ listIndex, qty, size }));
    setFormHasError(false);
  };

  let error = uploadError !== "" && isNaN(sizesList[size]);

  return (
    <FormControl className={styles.form_control_size} error={error}>
      <InputLabel htmlFor="outlined-size-qty">{capitalize(size)}</InputLabel>
      <OutlinedInput
        id="outlined-size-qty"
        type="number"
        name={size}
        value={isNaN(sizesList[size]) ? "" : sizesList[size]}
        onChange={sizesChangeHandler}
        inputProps={{ min: 0 }}
        label={size}
        placeholder="0"
        error={error}
        startAdornment={<div></div>}
        className={styles.input_box_shadow}
      />
      <FormHelperText className={styles.input_error}>
        {error && uploadError}
      </FormHelperText>
    </FormControl>
  );
}

export default memo(AddSizeQuantity);
