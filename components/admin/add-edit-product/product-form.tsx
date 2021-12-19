import { useRouter } from "next/dist/client/router";
import React, { Fragment, useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setPageLoading } from "../../../utils/redux-store/layoutSlice";
import {
  addMoreColor_adminProduct,
  resetState_adminProduct,
  selectColorPropsList,
  selectCurrentCats_adminProduct,
  selectUploadStatus_adminProduct,
  setUploadStatus_adminProduct,
  uploadNewProduct,
} from "../../../utils/redux-store/adminProductSlice";

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
import { sxMUI } from "./__styles-MUI";

interface Props {
  editMode: boolean;
  productId?: string;
}

function ProductForm(props: Props): JSX.Element {
  const { editMode, productId } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const colorPropsList = useSelector(selectColorPropsList);
  const uploadStatus = useSelector(selectUploadStatus_adminProduct);
  const { main_cat, sub_cat } = useSelector(selectCurrentCats_adminProduct);

  const [formHasError, setFormHasError] = useState<boolean>(false);

  useEffect(() => {
    if (uploadStatus === "failed") {
      dispatch(setPageLoading(false));
      setFormHasError(true);
    }
    if (uploadStatus === "succeeded") {
      router.push(`/admin/products-list?main=${main_cat}&sub=${sub_cat}`);
    }
  }, [uploadStatus, dispatch, router, main_cat, sub_cat]);

  // clear the state when component is being unmounted
  useEffect(() => {
    return () => {
      dispatch(setUploadStatus_adminProduct("idle"));
    };
  }, []);

  const cancelButtonHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(resetState_adminProduct());
    router.push(`/admin/products-list?main=${main_cat}&sub=${sub_cat}`);
  };

  const uploadHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(uploadNewProduct({ editMode, productId }));
  };

  return (
    <div className={styles.main_grid}>
      <div className={styles.main_title}>PRODUCT INFO</div>

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
      <Grid
        item
        container
        className={styles.form_grid_space_between}
        sx={{ mt: "20px" }}
      >
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddCircleIcon sx={sxMUI.form_button_icon} />}
            sx={sxMUI.form_button}
            onClick={() => {
              dispatch(addMoreColor_adminProduct());
            }}
          >
            Add more colors
          </Button>
        </Grid>

        <div className={styles.save_buttons_box}>
          <LoadingButton
            loading={uploadStatus === "loading" || uploadStatus === "succeeded"}
            loadingPosition="start"
            startIcon={<SaveIcon sx={sxMUI.form_button_icon} />}
            sx={sxMUI.form_button}
            variant="contained"
            onClick={uploadHandler}
          >
            Save
          </LoadingButton>
          <Button
            color="error"
            variant="outlined"
            sx={sxMUI.form_button}
            onClick={cancelButtonHandler}
          >
            Cancel
          </Button>
        </div>
      </Grid>

      {formHasError && (
        <div className={styles.form_error}>
          Something is missing, please check the form again
        </div>
      )}
    </div>
  );
}

export default memo(ProductForm);
