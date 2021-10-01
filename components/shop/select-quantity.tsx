import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { directChangeQty } from "../../utils/redux-store/userSlice";

interface Props {
  quantity: number;
  disabled: boolean;
  totalQty: number;
  setQuantity?: Dispatch<SetStateAction<number>>;
  directChange?: boolean;
  index?: number;
}

export default function SelectQuantity({
  quantity,
  disabled,
  totalQty,
  setQuantity,
  directChange,
  index,
}: Props): JSX.Element {
  const [qtyArray] = useState<number[]>(() => {
    let arr = [];
    console.log(totalQty);
    if (totalQty > 0 && totalQty <= 5) {
      for (let i = 1; i <= totalQty; i++) {
        arr.push(i);
      }
      return arr;
    } else if (totalQty <= 0) {
      return [0];
    } else {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
  });

  const dispatch = useDispatch();

  const changeHandler = (e: SelectChangeEvent<number>) => {
    if (directChange && index !== undefined) {
      if (typeof e.target.value === "number") {
        dispatch(directChangeQty({ quantity: e.target.value, index }));
        return;
      }
    }
    if (setQuantity) {
      if (typeof e.target.value === "number") {
        setQuantity(e.target.value);
        return;
      }
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 0, minWidth: 120, boxShadow: 0 }}>
      <InputLabel style={{ fontSize: "1rem" }}>Quantity</InputLabel>
      <Select
        value={quantity}
        type="number"
        label="Quantity"
        sx={{ m: 0, minWidth: 130 }}
        onChange={changeHandler}
        disabled={totalQty === 0 || disabled}
      >
        {qtyArray.map((q) => {
          return (
            <MenuItem key={q} value={q}>
              {q}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
