import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { inputNames } from "../../../utils/enums-types/input-names";
import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";

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
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}
export default function AddPrice(props: Props): JSX.Element {
  const {
    productInfo,
    dispatchAddInfo,
    propError,
    setErrors,
    setFormHasError,
  } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setFormHasError(false);
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  const error = !(
    propError[inputNames.price] === undefined ||
    propError[inputNames.price] === ""
  );

  return (
    <Grid
      item
      // container
      // xs={12}
      // sm={6}
      // md={12}
      // className={styles.form_grid_center}
    >
      <FormControl className={styles.form_control} error={error}>
        <InputLabel htmlFor="outlined-price">Price</InputLabel>
        <OutlinedInput
          id="outlined-price"
          type="number"
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          name={inputNames.price}
          value={isNaN(productInfo.price as number) ? "" : productInfo.price}
          onChange={onChangeHandler}
          inputProps={{ min: 0 }}
          label="Price"
          placeholder="0"
          error={error}
          className={styles.input_box_shadow}
        />
        <FormHelperText className={styles.input_error}>
          {propError[inputNames.price]}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
}
