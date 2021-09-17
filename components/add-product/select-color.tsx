import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

import {
  InputLabel,
  MenuItem,
  FormControl,
  FormHelperText,
  Select,
} from "@mui/material";

import {
  ProductProps,
  PropsChangeHandler,
} from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/use-upload";
import { FieldNames } from "../../util/enums/input-field-names-enum";

interface Props {
  propsChangeHandler: PropsChangeHandler;
  productProp: ProductProps;
  listIndex: number;
  propError: Errors | null | undefined;
}

export default function SelectColor(props: Props): JSX.Element {
  const { productProp, listIndex, propsChangeHandler, propError } = props;

  const selectColorNameHandler = (e: SelectChangeEvent<string>) => {
    console.log("select colorName", listIndex);
    const colorName = e.target.value;
    const inputField = e.target.name;
    propsChangeHandler(colorName, inputField, listIndex);
  };

  const selectColorCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("select colorCode", listIndex);
    const colorCode = e.currentTarget.value;
    const inputField = e.currentTarget.name;
    propsChangeHandler(colorCode, inputField, listIndex);
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
              name={FieldNames.colorCode}
              value={productProp.colorCode}
              onChange={selectColorCodeHandler}
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
        {propError && productProp.colorCode === "" && (
          <div>{propError[FieldNames.colorCode]}</div>
        )}
      </span>
      <span>
        <FormControl>
          <InputLabel>Color Name</InputLabel>

          <Select
            label="Color Name"
            value={productProp.colorName}
            name={FieldNames.colorName}
            onChange={selectColorNameHandler}
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
        {propError && productProp.colorName === "" && (
          <div>{propError[FieldNames.colorName]}</div>
        )}
      </span>
      <span>
        picked color
        <div
          style={{
            height: "30px",
            width: "30px",
            backgroundColor: `${productProp.colorName}`,
          }}
        >
          123
        </div>
      </span>
    </div>
  );
}
