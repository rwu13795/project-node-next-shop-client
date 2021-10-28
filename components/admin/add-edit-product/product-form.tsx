import { useRouter } from "next/dist/client/router";
import React, {
  useReducer,
  ChangeEvent,
  useEffect,
  Dispatch,
  SetStateAction,
  Fragment,
} from "react";

import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
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
import { Divider, SelectChangeEvent, Grid } from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  colorPropsList: ReducerColorProps[];
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  editMode: boolean;
  dispatch: Dispatch<ActionType>;
  uploadHandler: () => Promise<void>;
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
  } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="center"
      className={styles.root_grid}
      sx={{ minWidth: "80vw" }}
    >
      <Grid item container justifyContent="center" md={6}>
        <div>Product Info</div>
      </Grid>
      <Grid
        item
        container
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid
          item
          container
          flexDirection="row"
          justifyContent="center"
          style={{ alignItems: "center" }}
          xs={12}
          md={6}
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
          />
        </Grid>
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          xs={12}
          md={6}
        >
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
              <div>Color #{index + 1}</div>
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
        <button
          onClick={() => {
            dispatch({ type: Actions.addMoreColor });
          }}
        >
          Add more colors
        </button>

        <div>
          <button onClick={uploadHandler}>upload</button>
        </div>
      </Grid>
    </Grid>
  );
}
