import { ChangeEvent, Dispatch } from "react";
import { SelectChangeEvent } from "@mui/material";

import {
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
} from "@mui/material";

import { Errors } from "../../util/react-hooks/add-product-upload";
import { FieldNames } from "../../util/enums/input-field-names";
import {
  ActionType,
  ColorProps,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums/reducer-actions";

interface Props {
  colorProps: ColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  // propError: Errors | null | undefined;
}

export default function SelectColor(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch } = props;

  const selectColorHandler = (
    e: SelectChangeEvent<string> | ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    dispatch({
      type: Actions.addColorInfo,
      payload: { listIndex, inputField, inputValue },
    });
  };

  // const selectColorCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log("select colorCode", listIndex);
  //   const colorCode = e.currentTarget.value;
  //   const inputField = e.currentTarget.name;
  //   propsChangeHandler(colorCode, inputField, listIndex);
  // };

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
              name={FieldNames.colorCode}
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
        {/* {propError && productProp.colorCode === "" && (
          <div>{propError[FieldNames.colorCode]}</div>
        )} */}
      </span>
      <span>
        <FormControl>
          <InputLabel>Color Name</InputLabel>

          <Select
            label="Color Name"
            value={colorProps.colorName}
            name={FieldNames.colorName}
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
        {/* {propError && productProp.colorName === "" && (
          <div>{propError[FieldNames.colorName]}</div>
        )} */}
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
