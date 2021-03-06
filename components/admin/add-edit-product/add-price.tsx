import { ChangeEvent, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectPrice_adminProduct,
  selectUploadError_byInputName,
  setPrice_adminProduct,
} from "../../../utils/redux-store/adminProductSlice";
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
  useMediaQuery,
} from "@mui/material";
import styles from "./__styles.module.css";
import { sxMUI } from "./__styles-MUI";

interface Props {
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddPrice({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const price = useSelector(selectPrice_adminProduct);
  const uploadError = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.price)
  );

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    dispatch(clearUploadError_byInputName(inputNames.price));
    setFormHasError(false);
    dispatch(setPrice_adminProduct(value));
  };

  const isSmall = useMediaQuery("(max-width: 550px)");

  const error = uploadError !== "";

  return (
    <Grid item>
      <FormControl
        error={error}
        sx={isSmall ? sxMUI.form_control_small : sxMUI.form_control}
      >
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
        <FormHelperText sx={sxMUI.input_error}>{uploadError}</FormHelperText>
      </FormControl>
    </Grid>
  );
}

export default memo(AddPrice);
