import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, FocusEvent } from "react";

const stateArray = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "MontanaNebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  " West Virginia",
  "Wisconsin",
  "Wyoming",
];

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
      <InputLabel style={{ fontSize: "1rem" }}>STATE</InputLabel>
      <Select
        value={value}
        name={inputName}
        label="STATE"
        sx={{ m: 0, minWidth: 130 }}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        onChange={onChangeHandler}
      >
        {stateArray.map((state) => {
          return (
            <MenuItem key={state} value={state}>
              {state}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
