import { ChangeEvent, Dispatch, Fragment, MouseEvent } from "react";

import SelectColor from "./select-color";
import { FieldNames } from "../../util/enums/input-field-names";
import { Errors } from "../../util/react-hooks/add-product-upload";
import AddImage from "./add-image";
import {
  ActionType,
  ColorProps,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums/reducer-actions";

interface Props {
  colorProps: ColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  propError: Errors | null | undefined;
}

export default function AddColorsProps(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch, propError } = props;

  const sizesArray = [FieldNames.small, FieldNames.medium, FieldNames.large];

  const sizesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    dispatch({
      type: Actions.addSizes,
      payload: { listIndex, inputValue, inputField },
    });
  };

  const removeColorHandler = () => {
    dispatch({ type: Actions.removeColor, payload: { listIndex } });
  };

  return (
    <Fragment>
      <SelectColor
        colorProps={colorProps}
        listIndex={listIndex}
        dispatch={dispatch}
        propError={propError}
      />

      <div>
        <label>Sizes: </label>
        {sizesArray.map((size) => {
          return (
            <Fragment key={size}>
              <label>{size}</label>
              <input
                required
                placeholder={"0"}
                type="number"
                min={0}
                name={size}
                value={colorProps.sizes[size]}
                onChange={sizesChangeHandler}
              />
            </Fragment>
          );
        })}
      </div>
      <AddImage
        colorProps={colorProps}
        listIndex={listIndex}
        dispatch={dispatch}
        propError={propError}
      />
      <div>
        <button name={FieldNames.removeColor} onClick={removeColorHandler}>
          Remove this color
        </button>
      </div>
    </Fragment>
  );
}
