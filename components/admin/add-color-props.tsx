import { ChangeEvent, Dispatch, Fragment, SetStateAction } from "react";

import SelectColor from "./select-color";
import { inputNames } from "../../util/enums-types/input-names";
import { Errors } from "../../util/react-hooks/input-error-check";
import AddImage from "./add-image";
import {
  ActionType,
  ReducerColorProps,
} from "../../util/react-hooks/add-product-reducer";
import { Actions } from "../../util/enums-types/product-reducer-actions";

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  propError: Errors;
  editMode: boolean;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function AddColorsProps(props: Props): JSX.Element {
  const { colorProps, listIndex, dispatch, propError, editMode, setErrors } =
    props;

  const sizesArray = [inputNames.small, inputNames.medium, inputNames.large];

  const sizesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    dispatch({
      type: Actions.addSizes,
      payload: { listIndex, inputValue, inputField },
    });
  };

  const removeColorHandler = () => {
    dispatch({ type: Actions.removeColor, payload: { listIndex, editMode } });
  };

  return (
    <Fragment>
      <SelectColor
        colorProps={colorProps}
        listIndex={listIndex}
        dispatch={dispatch}
        propError={propError}
        setErrors={setErrors}
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
        editMode={editMode}
        propError={propError}
      />
      <div>
        <button name={inputNames.removeColor} onClick={removeColorHandler}>
          Remove this color
        </button>
      </div>
    </Fragment>
  );
}
