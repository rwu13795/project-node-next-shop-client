import { Dispatch, SetStateAction } from "react";

import SelectColor from "./select-color";
import { inputNames } from "../../../utils/enums-types/input-names";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import AddImage from "./add-image";
import {
  ActionType,
  ReducerColorProps,
} from "../../../utils/react-hooks/add-product-reducer";
import { Actions } from "../../../utils/enums-types/product-reducer-actions";
import AddSizeQuantity from "./add-size-quantity";

// UI //
import { Grid, Box, Divider, Button } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import styles from "./__styles.module.css";
import main_styles from "../../layout/__layout.module.css";

interface Props {
  colorProps: ReducerColorProps;
  listIndex: number;
  dispatch: Dispatch<ActionType>;
  propError: Errors;
  editMode: boolean;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}

const sizesArray = [inputNames.small, inputNames.medium, inputNames.large];

export default function AddColorsProps(props: Props): JSX.Element {
  const {
    colorProps,
    listIndex,
    dispatch,
    propError,
    editMode,
    setErrors,
    setFormHasError,
  } = props;

  const removeColorHandler = () => {
    dispatch({ type: Actions.removeColor, payload: { listIndex, editMode } });
  };

  return (
    <Grid item container className={styles.colorProps_grid}>
      <Grid item container className={styles.form_grid_space_between}>
        <Box className={main_styles.text_4}>Color #{listIndex + 1}</Box>
        <Box>
          <Button
            variant="outlined"
            color="warning"
            startIcon={
              <DeleteForeverIcon className={styles.form_button_icon_small} />
            }
            className={styles.form_button_small}
            name={inputNames.removeColor}
            onClick={removeColorHandler}
          >
            Remove this color
          </Button>
        </Box>
      </Grid>
      <Grid item container justifyContent="center">
        <Grid item container xs={12} sm={6} md={6}>
          <SelectColor
            colorProps={colorProps}
            listIndex={listIndex}
            dispatch={dispatch}
            propError={propError}
            setErrors={setErrors}
            setFormHasError={setFormHasError}
          />
        </Grid>
        <Grid
          item
          container
          flexDirection="row"
          xs={12}
          sm={6}
          md={6}
          className={styles.form_grid_center}
        >
          {sizesArray.map((size) => {
            return (
              <AddSizeQuantity
                key={size}
                size={size}
                colorProps={colorProps}
                listIndex={listIndex}
                dispatch={dispatch}
                propError={propError}
                setErrors={setErrors}
                setFormHasError={setFormHasError}
              />
            );
          })}
        </Grid>
      </Grid>

      <Grid item container>
        <AddImage
          colorProps={colorProps}
          listIndex={listIndex}
          dispatch={dispatch}
          editMode={editMode}
          propError={propError}
          setFormHasError={setFormHasError}
        />
      </Grid>
    </Grid>
  );
}
