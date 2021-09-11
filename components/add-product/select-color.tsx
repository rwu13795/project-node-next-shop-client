import { useState, ChangeEvent, MouseEvent } from "react";
import { Dropdown, Row, Col } from "react-bootstrap";

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
              required
              type="color"
              name="colorCode"
              value={productProp.colorCode}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                propsChangeHandler(e, listIndex)
              }
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
      </span>
      <span>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-autoclose-true">
            Dropdown Button
          </Dropdown.Toggle>

          <Dropdown.Menu
            style={{
              width: "20rem",
              flexFlow: "row",
            }}
          >
            <Row>
              <Col xs="12" md="6">
                <Dropdown.Item
                  data-color="red"
                  onClick={selectColorNameHandler}
                  style={{
                    position: "relative",
                    display: "flex",
                    flexFlow: "row",
                    alignItems: "center",
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
                </Dropdown.Item>
                <Dropdown.Item
                  data-color="blue"
                  onClick={selectColorNameHandler}
                >
                  blue
                </Dropdown.Item>
              </Col>
              <Col>
                <Dropdown.Item
                  data-color="pink"
                  onClick={selectColorNameHandler}
                >
                  pink
                </Dropdown.Item>
              </Col>
            </Row>
          </Dropdown.Menu>
        </Dropdown>
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
};

export default SelectColor;
