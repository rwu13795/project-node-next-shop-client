import { ChangeEvent, Dispatch, SetStateAction, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectPrice_addProduct,
  selectUploadError_byInputName,
  setPrice_addProduct,
} from "../../../utils/redux-store/addProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";

// UI //
import {
  FormHelperText,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  Grid,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddPrice({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const price = useSelector(selectPrice_addProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.price)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.price));
    setFormHasError(false);
    dispatch(setPrice_addProduct(parseInt(value)));
  };

  const error = uploadError !== "";

  console.log("re-rendering in PRICE");

  return (
    <Grid item>
      <FormControl className={styles.form_control} error={error}>
        <InputLabel htmlFor="outlined-price">Price</InputLabel>
        <OutlinedInput
          id="outlined-price"
          type="number"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          name={inputNames.price}
          value={isNaN(price as number) ? "" : price}
          onChange={onChangeHandler}
          inputProps={{ min: 0 }}
          label="Price"
          placeholder="0"
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

export default memo(AddPrice);
