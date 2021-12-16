import { useRouter } from "next/dist/client/router";
import React, {
  Dispatch,
  SetStateAction,
  Fragment,
  useState,
  useEffect,
} from "react";

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
import {
  addMoreColor_addProduct,
  resetState_addProduct,
  selectColorPropsList,
  selectUploadErrors_addProduct,
  selectUploadStatus_addProduct,
  setUploadStatus_addProduct,
  uploadNewProduct,
} from "../../../utils/redux-store/addProductSlice";

interface Props {
  // dispatchAddInfo: (e: AddInfoEvents) => void;
  // productInfo: ReducerProductInfo;
  // colorPropsList: ReducerColorProps[];
  // propError: Errors;
  // setErrors: Dispatch<SetStateAction<Errors>>;
  editMode: boolean;
  productId?: string;
  // dispatch: Dispatch<ActionType>;
  // uploadHandler: () => Promise<void>;
  // uploading: boolean;
}

export default function ProductForm(props: Props): JSX.Element {
  const {
    // dispatchAddInfo,
    // productInfo,
    // colorPropsList,
    // propError,
    // setErrors,
    editMode,
    productId,
    // dispatch,
    // uploadHandler,
    // uploading,
  } = props;

  const router = useRouter();
  const dispatch = useDispatch();

  const colorPropsList = useSelector(selectColorPropsList);
  const uploadStatus = useSelector(selectUploadStatus_addProduct);
  const uploadErrors = useSelector(selectUploadErrors_addProduct);

  const [formHasError, setFormHasError] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  console.log("re-rendering in product-form");

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
