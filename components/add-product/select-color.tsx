import { useState, ChangeEvent, MouseEvent } from "react";
import { Dropdown } from "react-bootstrap";

import { ProductProps } from "../../pages/admin/add-product";

interface Props {
  propsChangeHandler: (
    e: ChangeEvent<HTMLInputElement>,
    index: number,
    colorName?: string
  ) => void;
  productProp: ProductProps;
  listIndex: number;
}

const SelectColor = (props: Props): JSX.Element => {
  const { productProp, listIndex, propsChangeHandler } = props;

  const [colorCode, setColorCode] = useState("");
  const [colorName, setColorName] = useState("");

  const selectColorNameHandler = (
    e: MouseEvent<HTMLElement, globalThis.MouseEvent>
  ) => {
    // onClick dose not have the "value" field, we need to use the attribute
    // in the "dataset" by adding "data-propName", then access it using "dataset.propName"
    const colorName = e.currentTarget.dataset.color;

    let event: any; // by-pass the "ChangeEvent" type check in the function
    propsChangeHandler(event, listIndex, colorName);
  };

  console.log(productProp);

  return (
    <div>
      <span>
        <label>Select a color</label>
        <input
          required
          type="color"
          name="colorCode"
          value={productProp.colorCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            propsChangeHandler(e, listIndex)
          }
          style={{ borderRadius: "50%" }}
        />
      </span>
      <span>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Dropdown Button
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item data-color="red" onClick={selectColorNameHandler}>
              Red
              <div
                style={{
                  height: "50px",
                  width: "50px",
                  backgroundColor: "red",
                }}
              ></div>
            </Dropdown.Item>
            <Dropdown.Item data-color="blue" onClick={selectColorNameHandler}>
              blue
            </Dropdown.Item>
            <Dropdown.Item data-color="pink" onClick={selectColorNameHandler}>
              pink
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </span>
      <span>
        picked color
        <div
          style={{
            height: "30px",
            width: "30px",
            backgroundColor: `${colorName}`,
          }}
        >
          123
        </div>
      </span>
    </div>
  );
};

export default SelectColor;
