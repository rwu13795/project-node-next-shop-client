import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, FocusEvent } from "react";

const sizeArray = ["Small", "Medium", "Large"];

interface Props {
  value: string;
  inputName: string;
  onFocusHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onBlurHandler: (e: FocusEvent<HTMLInputElement>) => void;
  onChangeHandler: (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => void;
}

export default function SelectState(props: Props): JSX.Element {
  const { value, inputName, onFocusHandler, onBlurHandler, onChangeHandler } =
    props;
  return (
    <FormControl variant="standard" sx={{ m: 0, minWidth: 120, boxShadow: 0 }}>
      <InputLabel style={{ fontSize: "1rem" }}>SIZE</InputLabel>
      <Select
        value={value}
        name={inputName}
        label="SIZE"
        sx={{ m: 0, minWidth: 130 }}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
      >
        {sizeArray.map((size) => {
          return (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
