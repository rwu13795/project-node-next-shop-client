import { ChangeEvent, Dispatch, SetStateAction, Fragment } from "react";
import { SelectChangeEvent } from "@mui/material";

import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import { inputNames } from "../../../utils/enums-types/input-names";
import {
  ActionType,
  ReducerColorProps,
} from "../../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../../utils/enums-types/product-reducer-actions";
import { colorNames } from "../../../utils/enums-types/color-names";

// UI //
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Grid,
  Box,
  FormHelperText,
  TextField,
  OutlinedInput,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}

export default function SelectColor(props: Props): JSX.Element {
  const {
    colorProps,
    listIndex,
    dispatch,
    propError,
    setErrors,
    setFormHasError,
  } = props;

  const selectColorHandler = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    setFormHasError(false);
    onChangeErrorCheck(inputField, inputValue, setErrors);
    dispatch({
      type: Actions.addColorInfo,
      payload: { listIndex, inputField, inputValue },
    });
  };

  const error_colorName =
    !(
      propError[inputNames.colorName] === "" ||
      propError[inputNames.colorName] === undefined
    ) &&
    (colorProps.colorName === "" || colorProps.colorName === undefined);

  const error_colorCode =
    !(
      propError[inputNames.colorCode] === "" ||
      propError[inputNames.colorCode] === undefined
    ) &&
    (colorProps.colorCode === "" || colorProps.colorCode === undefined);

  return (
    <Fragment>
      <Grid
        item
        container
        xs={12}
        sm={12}
        md={6}
        className={styles.form_grid_center}
      >
        <FormControl
          error={error_colorCode}
          className={styles.form_control_color}
        >
          <InputLabel htmlFor="outlined-pick-color">Pick a Color</InputLabel>
          <OutlinedInput
            id="outlined-pick-color"
            type="color"
            label="Pick a Color"
            name={inputNames.colorCode}
            value={colorProps.colorCode}
            onChange={selectColorHandler}
            error={error_colorCode}
            // InputLabelProps={{
            //   shrink: true,
            // }}
            className={styles.input_box_shadow}
          />
          <FormHelperText className={styles.input_error}>
            {error_colorCode && propError[inputNames.colorCode]}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid
        item
        container
        xs={12}
        sm={12}
        md={6}
        className={styles.form_grid_center}
      >
        <FormControl
          error={error_colorName}
          className={styles.form_control_color}
        >
          <InputLabel>Color Name</InputLabel>
          <Select
            label="Color Name"
            value={colorProps.colorName}
            name={inputNames.colorName}
            onChange={selectColorHandler}
            className={styles.input_box_shadow}
          >
            {colorNames.map((color) => {
              return (
                <MenuItem key={color.name + color.code} value={color.name}>
                  <Grid
                    container
                    wrap="nowrap"
                    justifyContent="flex-start"
                    alignItems="center"
                  >
                    <Box>{color.name}</Box>
                    <Box
                      style={{ backgroundColor: `${color.code}` }}
                      className={styles.color_menu_ball}
                    ></Box>
                  </Grid>
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText className={styles.input_error}>
            {error_colorName && propError[inputNames.colorName]}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Fragment>
  );
}
