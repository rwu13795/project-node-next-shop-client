import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { SelectChangeEvent } from "@mui/material";

import {
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
} from "@mui/material";

import {
  Errors,
  onChangeErrorCheck,
} from "../../util/react-hooks/onChange-error-check";
import { inputNames } from "../../util/enums/input-names";
import {
  ActionType,
  ColorProps,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums/product-reducer-actions";

interface Props {
  colorProps: ColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function SelectColor(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch, propError, setErrors } = props;

  const selectColorHandler = (
    e: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    onChangeErrorCheck(inputField, inputValue, setErrors);
    dispatch({
      type: Actions.addColorInfo,
      payload: { listIndex, inputField, inputValue },
    });
  };

  return (
    <div>
      <span>
        <label>Select a color</label>
        <div
          style={{
            position: "relative",
            left: ".5rem",
            width: "3rem",
            height: "3rem",
            border: "red solid",
            borderRadius: "50%",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              top: "7.5%",
              left: "8%",
              width: "2.3rem",
              height: "2.3rem",
              borderRadius: "50%",
              overflow: "hidden",
            }}
          >
            <input
              type="color"
              name={inputNames.colorCode}
              value={colorProps.colorCode}
              onChange={selectColorHandler}
              style={{
                position: "relative",
                bottom: "10px",
                right: "10px",
                margin: 0,
                padding: 0,
                width: "4rem",
                height: "4rem",
              }}
            />
          </div>
        </div>

        <span>{propError[inputNames.colorCode]}</span>
      </span>
      <span>
        <FormControl>
          <InputLabel>Color Name</InputLabel>

          <Select
            label="Color Name"
            value={colorProps.colorName}
            name={inputNames.colorName}
            onChange={selectColorHandler}
          >
            <MenuItem
              value="red"
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "row",
                alignItems: "center",
                minWidth: "15rem",
              }}
            >
              <div style={{ fontSize: "1.3rem" }}>Red</div>
              <div
                style={{
                  position: "relative",
                  left: "5%",
                  height: "1.55rem",
                  width: "1.55rem",
                  backgroundColor: "red",
                  borderRadius: "50%",
                }}
              ></div>
            </MenuItem>

            <MenuItem value="blue">blue</MenuItem>

            <MenuItem value="pink">pink</MenuItem>
          </Select>
        </FormControl>

        <span>{propError[inputNames.colorName]}</span>
      </span>
      <span>
        picked color
        <div
          style={{
            height: "30px",
            width: "30px",
            backgroundColor: `${colorProps.colorName}`,
          }}
        >
          123
        </div>
      </span>
    </div>
  );
}
