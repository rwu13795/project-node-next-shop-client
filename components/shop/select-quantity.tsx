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
  quantity: string;
  totalQty: number;
  setQuantity?: Dispatch<SetStateAction<string>>;
  directChange?: boolean;
  index?: number;
}

export default function SelectQuantity({
  quantity,
  totalQty,
  setQuantity,
  directChange,
  index,
}: Props): JSX.Element {
  const [qtyArray] = useState<string[]>(() => {
    let arr = [];
    if (totalQty > 0 && totalQty <= 5) {
      for (let i = 1; i <= totalQty; i++) {
        arr.push(i.toString());
      }
      return arr;
    } else {
      return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
    }
  });

  const dispatch = useDispatch();

  const changeHandler = (e: SelectChangeEvent<string>) => {
    if (directChange && index !== undefined) {
      console.log("direct change index", index);
      dispatch(directChangeQty({ quantity: parseInt(e.target.value), index }));
      return;
    }
    if (setQuantity) {
      setQuantity(e.target.value);
      return;
    }
  };

  return (
    <FormControl variant="standard" sx={{ m: 0, minWidth: 120, boxShadow: 0 }}>
      <InputLabel style={{ fontSize: "1rem" }}>Quantity</InputLabel>
      <Select
        value={quantity}
        label="Quantity"
        sx={{ m: 0, minWidth: 130 }}
        onChange={changeHandler}
        disabled={totalQty === 0}
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
