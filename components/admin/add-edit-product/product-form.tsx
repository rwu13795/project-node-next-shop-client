import { useRouter } from "next/dist/client/router";
import React, { Dispatch, SetStateAction, Fragment } from "react";

import { Errors } from "../../../utils/helper-functions/input-error-check";
import {
  ActionType,
  ReducerColorProps,
  ReducerProductInfo,
} from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import { Actions } from "../../../utils/enums-types/product-reducer-actions";
import SelectCategory from "./select-category";
import AddTitle from "./add-title";
import AddPrice from "./add-price";
import AddDescription from "./add-description";
import AddColorsProps from "./add-color-props";

// UI //
import { Grid, Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SaveIcon from "@mui/icons-material/Save";
import styles from "./__styles.module.css";
import main_styles from "../../layout/__layout.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPageLoading,
  setPageLoading,
} from "../../../utils/redux-store/layoutSlice";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  colorPropsList: ReducerColorProps[];
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  editMode: boolean;
  dispatch: Dispatch<ActionType>;
  uploadHandler: () => Promise<void>;
  uploading: boolean;
}

export default function ProductForm(props: Props): JSX.Element {
  const {
    dispatchAddInfo,
    productInfo,
    colorPropsList,
    propError,
    setErrors,
    editMode,
    dispatch,
    uploadHandler,
    uploading,
  } = props;

  const router = useRouter();
  const reduxDispatch = useDispatch();

  const pageLoading = useSelector(selectPageLoading);

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={styles.main_grid}
    >
      <Grid item container justifyContent="center" md={6}>
        <div className={main_styles.text_3}>Product Info</div>
      </Grid>
      <Grid
        item
        container
        // flexDirection="row"
        // justifyContent="center"
        // alignItems="center"
      >
        <Grid
          item
          container
          xs={12}
          md={6}
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
        >
          <SelectCategory
            dispatchAddInfo={dispatchAddInfo}
            productInfo={productInfo}
            propError={propError}
            setErrors={setErrors}
          />

          <AddTitle
            dispatchAddInfo={dispatchAddInfo}
            productInfo={productInfo}
            propError={propError}
            setErrors={setErrors}
          />
          <AddPrice
            dispatchAddInfo={dispatchAddInfo}
            productInfo={productInfo}
            propError={propError}
            setErrors={setErrors}
          />
        </Grid>
        <Grid item container xs={12} md={6} className={styles.form_grid_center}>
          <AddDescription
            dispatchAddInfo={dispatchAddInfo}
            productInfo={productInfo}
            propError={propError}
            setErrors={setErrors}
          />
        </Grid>
      </Grid>

      <Grid item container>
        {colorPropsList.map((prop, index) => {
          return (
            <Fragment key={index}>
              <AddColorsProps
                colorProps={prop}
                listIndex={index}
                dispatch={dispatch}
                propError={propError}
                editMode={editMode}
                setErrors={setErrors}
              />
            </Fragment>
          );
        })}
      </Grid>
      <Grid item container className={styles.form_grid_space_between}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon className={styles.form_button_icon} />}
            className={styles.form_button}
            onClick={() => {
              dispatch({ type: Actions.addMoreColor });
            }}
          >
            Add more colors
          </Button>
        </Grid>

        <Grid item>
          <LoadingButton
            loading={uploading}
            loadingPosition="start"
            startIcon={<SaveIcon className={styles.form_button_icon} />}
            className={styles.form_button}
            variant="contained"
            onClick={() => {
              reduxDispatch(setPageLoading(true));
              uploadHandler();
            }}
          >
            Save
          </LoadingButton>
          <Button
            color="error"
            variant="outlined"
            className={styles.form_button}
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
