import {
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { inputNames } from "../../../utils/enums-types/input-names";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import {
  clearStockErrors,
  directChangeQty,
} from "../../../utils/redux-store/userSlice";

interface Props {
  quantity: number;
  disabled: boolean;
  availableQty: number | undefined;
  setQuantity?: Dispatch<SetStateAction<number>>;
  setErrors?: Dispatch<SetStateAction<Errors>>;
  directChange?: boolean;
  index?: number;
}

export default function SelectQuantity({
  quantity,
  disabled,
  availableQty,
  setQuantity,
  setErrors,
  directChange,
  index,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const [qtyArray, setQtyArray] = useState<number[]>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  ]);

  useEffect(() => {
    let arr = [];
    if (!availableQty) {
      return;
    }
    if (availableQty > 0 && availableQty <= 9) {
      for (let i = 0; i <= availableQty; i++) {
        arr.push(i);
      }
      setQtyArray(arr);
    } else if (availableQty <= 0) {
      setQtyArray([0]);
    } else {
      setQtyArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    }
  }, [availableQty]);

  const changeHandler = (e: SelectChangeEvent<number>) => {
    if (directChange && index !== undefined) {
      if (typeof e.target.value === "number") {
        dispatch(directChangeQty({ quantity: e.target.value, index }));
        dispatch(clearStockErrors(index));
        return;
      }
    }
    if (setQuantity && setErrors) {
      if (typeof e.target.value === "number") {
        setQuantity(e.target.value);
        setErrors({ [inputNames.quantity]: "" });
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
        disabled={availableQty === 0 || disabled}
        // fixed the scrollbar lock when the select-menu is opened by adding
        // "disableScrollLock: true"
        MenuProps={{ disableScrollLock: true }}
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
