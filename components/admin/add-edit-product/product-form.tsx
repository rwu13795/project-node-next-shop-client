import { useRouter } from "next/dist/client/router";
import React, { Fragment, useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import {
  addMoreColor_addProduct,
  resetState_addProduct,
  selectColorPropsList,
  selectUploadStatus_addProduct,
  setUploadStatus_addProduct,
  uploadNewProduct,
} from "../../../utils/redux-store/addProductSlice";

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

interface Props {
  editMode: boolean;
  productId?: string;
}

function ProductForm(props: Props): JSX.Element {
  const { editMode, productId } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const colorPropsList = useSelector(selectColorPropsList);
  const uploadStatus = useSelector(selectUploadStatus_addProduct);

  const [formHasError, setFormHasError] = useState<boolean>(false);

  useEffect(() => {
    if (uploadStatus === "failed") {
      dispatch(setPageLoading(false));
      setFormHasError(true);
    }
    if (uploadStatus === "succeeded") {
      router.push("/admin/products-list");
    }
  }, [uploadStatus, dispatch, router]);

  useEffect(() => {
    return () => {
      dispatch(setUploadStatus_addProduct("idle"));
    };
  }, []);

  const cancelButtonHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(resetState_addProduct());
    router.push("/admin/products-list");
  };

  const uploadHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(uploadNewProduct({ editMode, productId }));
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      className={styles.main_grid}
    >
      <Grid item container justifyContent="center" md={6}>
        <h1>Product Info</h1>
      </Grid>
      <Grid item container>
        <Grid
          item
          container
          xs={12}
          md={6}
          className={styles.form_grid_flex_start}
        >
          <SelectCategory setFormHasError={setFormHasError} />
          <AddTitle setFormHasError={setFormHasError} />
          <AddPrice setFormHasError={setFormHasError} />
        </Grid>
        <Grid
          item
          container
          xs={12}
          md={6}
          className={styles.form_grid_flex_start}
        >
          <AddDescription setFormHasError={setFormHasError} />
        </Grid>
      </Grid>

      <Grid item container>
        {colorPropsList.map((prop, index) => {
          return (
            <Fragment key={index}>
              <AddColorsProps
                colorProps={prop}
                listIndex={index}
                editMode={editMode}
                setFormHasError={setFormHasError}
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
              dispatch(addMoreColor_addProduct());
            }}
          >
            Add more colors
          </Button>
        </Grid>

        <Grid item>
          <LoadingButton
            loading={uploadStatus === "loading"}
            loadingPosition="start"
            startIcon={<SaveIcon className={styles.form_button_icon} />}
            className={styles.form_button}
            variant="contained"
            onClick={uploadHandler}
          >
            Save
          </LoadingButton>
          <Button
            color="error"
            variant="outlined"
            className={styles.form_button}
            onClick={cancelButtonHandler}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
      <Grid>
        {formHasError && (
          <div className={styles.form_error}>
            Something is missing, please check the form again
          </div>
        )}
      </Grid>
    </Grid>
  );
}

export default memo(ProductForm);
