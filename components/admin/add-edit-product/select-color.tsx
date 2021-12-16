import { ChangeEvent, Dispatch, SetStateAction, Fragment, memo } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  selectUploadError_byInputName,
  setColorInfo_addProduct,
} from "../../../utils/redux-store/addProductSlice";
import { RootState } from "../../../utils/redux-store";

interface Props {
  colorName: string;
  colorCode: string;
  listIndex: number;
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function SelectColor({
  colorName,
  colorCode,
  listIndex,
  setFormHasError,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const uploadError_colorName = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.colorName)
  );
  const uploadError_colorCode = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.colorCode)
  );

  const selectColorHandler = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormHasError(false);
    dispatch(setColorInfo_addProduct({ listIndex, name, value }));
  };

  const error_colorName =
    uploadError_colorName !== "" &&
    (colorName === "" || colorName === undefined);

  const error_colorCode =
    uploadError_colorCode !== "" &&
    (colorCode === "" || colorCode === undefined);

  console.log("rendering in Select-color");

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
            value={colorCode}
            onChange={selectColorHandler}
            // error={error_colorCode}
            // InputLabelProps={{
            //   shrink: true,
            // }}
            className={styles.input_box_shadow}
          />
          <FormHelperText className={styles.input_error}>
            {error_colorCode && uploadError_colorCode}
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
            value={colorName}
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
            {error_colorName && uploadError_colorName}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Fragment>
  );
}

export default memo(SelectColor);
