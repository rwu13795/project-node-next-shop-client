import { Dispatch, SetStateAction, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

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
import {
  ColorPropsState,
  removeColor_addProduct,
} from "../../../utils/redux-store/addProductSlice";

interface Props {
  colorProps: ColorPropsState;
  listIndex: number;
  editMode: boolean;
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

const sizesArray = [inputNames.small, inputNames.medium, inputNames.large];

function AddColorsProps({
  colorProps,
  listIndex,
  editMode,
  setFormHasError,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const removeColorHandler = () => {
    dispatch(removeColor_addProduct({ listIndex, editMode }));
  };

  console.log("in add colorProps", colorProps);

  // NOTE //
  // always, only pass the specific value which will be consumed by the component
  // DO NOT pass the entire object to the child component which only needs part of
  // the value in the object (for instance, in the "select-color" component, it only
  // needs the "colorName" and "colorCode" from the "colorProp", if I pass the entire
  // "colorProp" to the "select-color", even there is change apart from the "colorName"
  // and "colorCode", "select-color" component will be re-rendered since the entire
  // "colorProp" object is passed into it)

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
            colorName={colorProps.colorName}
            colorCode={colorProps.colorCode}
            listIndex={listIndex}
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
                sizesList={colorProps.sizes}
                listIndex={listIndex}
                setFormHasError={setFormHasError}
              />
            );
          })}
        </Grid>
      </Grid>

      <Grid item container>
        <AddImage
          listIndex={listIndex}
          editMode={editMode}
          setFormHasError={setFormHasError}
        />
      </Grid>
    </Grid>
  );
}

export default memo(AddColorsProps);
