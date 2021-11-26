import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  memo,
} from "react";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

import { inputNames } from "../../../../../utils/enums-types/input-names";
import { Errors } from "../../../../../utils/helper-functions/input-error-check";
import {
  clearStockErrors,
  directChangeQty,
} from "../../../../../utils/redux-store/userSlice";

// UI //
import {
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import styles from "./__quantities.module.css";

interface Props {
  quantity: number;
  disabled: boolean;
  availableQty: number | undefined;
  setQuantity?: Dispatch<SetStateAction<number>>;
  setErrors?: Dispatch<SetStateAction<Errors>>;
  directChange?: boolean;
  index?: number;
  inCartDetail?: boolean;
}

function SelectQuantity({
  quantity,
  disabled,
  availableQty,
  setQuantity,
  setErrors,
  directChange,
  index,
  inCartDetail,
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

  const container = inCartDetail
    ? styles.form_container_in_cart
    : styles.form_container;
  const label = inCartDetail ? styles.form_label_in_cart : styles.form_label;
  const select = inCartDetail ? styles.form_select_in_cart : styles.form_select;
  const items = inCartDetail ? styles.form_items_in_cart : styles.form_items;

  return (
    <FormControl variant="standard" className={container}>
      <InputLabel className={label}>Quantity</InputLabel>
      <Select
        value={quantity}
        type="number"
        label="Quantity"
        onChange={changeHandler}
        disabled={availableQty === 0 || disabled}
        // fixed the scrollbar lock when the select-menu is opened by adding
        // "disableScrollLock: true"
        MenuProps={{ disableScrollLock: true }}
        className={select}
      >
        {qtyArray.map((q) => {
          return (
            <MenuItem key={q} value={q} className={items}>
              {q}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default memo(
  dynamic(() => Promise.resolve(SelectQuantity), {
    ssr: false,
  })
);
