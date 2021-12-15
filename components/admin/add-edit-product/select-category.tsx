import {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useState,
  memo,
} from "react";

import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { inputNames } from "../../../utils/enums-types/input-names";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import {
  mainCatArray,
  menCatArray,
  womenCatArray,
  kidsCatArray,
  MainCategory,
} from "../../../utils/enums-types/product-category";
import { capitalize } from "../../../utils/helper-functions/capitalize-first-letter";

// UI //
import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
  FormHelperText,
  Box,
  Grid,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}

function SelectCategory(props: Props): JSX.Element {
  const {
    dispatchAddInfo,
    productInfo,
    propError,
    setErrors,
    setFormHasError,
  } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  useEffect(() => {
    setNoMainCat(true);
    if (productInfo.main_cat !== "") {
      let main = capitalize(productInfo.main_cat);
      setNoMainCat(false);
      switch (main) {
        case MainCategory.men:
          setSubCatArray(menCatArray);
          break;
        case MainCategory.women:
          setSubCatArray(womenCatArray);
          break;
        case MainCategory.kids:
          setSubCatArray(kidsCatArray);
          break;
        default:
          break;
      }
    }
  }, [productInfo.main_cat]);

  const onChangeHandler = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormHasError(false);
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  let error_main = !(
    propError[inputNames.main] === undefined ||
    propError[inputNames.main] === ""
  );
  let error_sub = !(
    propError[inputNames.sub] === undefined || propError[inputNames.sub] === ""
  );

  return (
    <Fragment>
      <Grid item>
        <FormControl error={error_main} className={styles.form_control}>
          <InputLabel id="main-cat-select">Main-Category</InputLabel>
          <Select
            labelId="main-cat-select"
            value={capitalize(productInfo.main_cat)}
            name={inputNames.main}
            label="Main Category" // the length oflabel string will determine the length of line break in the box
            onChange={onChangeHandler}
            error={error_main}
            className={styles.input_box_shadow}
          >
            {mainCatArray.map((cat) => {
              return (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText className={styles.input_error}>
            {propError[inputNames.main]}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl error={error_sub} className={styles.form_control}>
          <InputLabel id="sub-cat-select">Sub-Category</InputLabel>
          <Select
            labelId="sub-cat-select"
            label="Sub Category"
            value={capitalize(productInfo.sub_cat)}
            name={inputNames.sub}
            onChange={onChangeHandler}
            disabled={noMainCat}
            error={error_sub}
            className={styles.input_box_shadow}
          >
            {subCatArray.map((cat, index) => {
              return (
                <MenuItem key={cat + index} value={cat}>
                  {cat}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText className={styles.input_error}>
            {propError[inputNames.sub]}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Fragment>
  );
}

export default memo(SelectCategory);
