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
} from "@mui/material";

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
    <FormControl sx={{ minWidth: 220 }}>
      <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
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
  );
}
