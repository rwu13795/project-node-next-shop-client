import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  memo,
  useCallback,
} from "react";

import { inputNames } from "../../../utils/enums-types/input-names";
import {
  ActionType,
  ReducerColorProps,
} from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import { Actions } from "../../../utils/enums-types/product-reducer-actions";
import { capitalize } from "../../../utils/helper-functions/capitalize-first-letter";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";

// UI //
import {
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Grid,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  size: string;
  dispatch: Dispatch<ActionType>;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}

function AddSizeQuantity(props: Props): JSX.Element {
  const {
    colorProps,
    listIndex,
    size,
    dispatch,
    propError,
    setErrors,
    setFormHasError,
  } = props;

  const addSizeHandler = useCallback(
    (inputValue: string, inputField: string) => {
      dispatch({
        type: Actions.addSizes,
        payload: { listIndex, inputValue, inputField },
      });
    },
    [dispatch, listIndex]
  );

  const sizesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name: inputField, value: inputValue } = e.currentTarget;
    setFormHasError(false);
    onChangeErrorCheck(inputField, inputValue, setErrors);
    // dispatch({
    //   type: Actions.addSizes,
    //   payload: { listIndex, inputValue, inputField },
    // });
    addSizeHandler(inputValue, inputField);
  };

  let error =
    !(
      propError[inputNames.size] === undefined ||
      propError[inputNames.size] === ""
    ) && isNaN(colorProps.sizes[size]);

  return (
    <FormControl className={styles.form_control_size} error={error}>
      <InputLabel htmlFor="outlined-size-qty">{capitalize(size)}</InputLabel>
      <OutlinedInput
        id="outlined-size-qty"
        type="number"
        name={size}
        value={isNaN(colorProps.sizes[size]) ? "" : colorProps.sizes[size]}
        onChange={sizesChangeHandler}
        inputProps={{ min: 0 }}
        label={size}
        placeholder="0"
        error={error}
        startAdornment={<div></div>}
        className={styles.input_box_shadow}
      />
      <FormHelperText className={styles.input_error}>
        {error && propError[inputNames.size]}
      </FormHelperText>
    </FormControl>
  );
}

export default memo(AddSizeQuantity);
