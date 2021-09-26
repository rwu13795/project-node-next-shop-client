import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";

interface Props {
  quantity: string;
  totalQty: number;
  setQuantity: Dispatch<SetStateAction<string>>;
}

export default function SelectQuantity({
  quantity,
  totalQty,
  setQuantity,
}: Props): JSX.Element {
  console.log(totalQty);

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

  return (
    <FormControl variant="standard" sx={{ m: 0, minWidth: 120, boxShadow: 0 }}>
      <InputLabel style={{ fontSize: "1rem" }}>Quantity</InputLabel>
      <Select
        value={quantity}
        label="Quantity"
        sx={{ m: 0, minWidth: 130 }}
        onChange={(e) => setQuantity(e.target.value)}
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
