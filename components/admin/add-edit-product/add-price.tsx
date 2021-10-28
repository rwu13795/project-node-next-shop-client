import { ChangeEvent } from "react";

import { inputNames } from "../../../utils/enums-types/input-names";
import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";

// UI //
import {
  TextField,
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
}
export default function AddPrice(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatchAddInfo(e);
  };

  return (
    <Grid item container xs={12} sm={6} md={12} className={styles.form_grid}>
      <FormControl className={styles.form_control}>
        <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
        <OutlinedInput
          id="outlined-adornment-amount"
          name={inputNames.price}
          value={productInfo.price}
          onChange={onChangeHandler}
          type="number"
          inputProps={{ min: 0 }}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label="Price"
        />
      </FormControl>
    </Grid>
  );
}
