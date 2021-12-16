import { Fragment, useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clearUploadError_byInputName,
  selectMainCat_addProduct,
  selectSubCat_addProduct,
  selectUploadError_byInputName,
  setMainCat_addProduct,
  setSubCat_addProduct,
} from "../../../utils/redux-store/addProductSlice";
import { RootState } from "../../../utils/redux-store";
import { inputNames } from "../../../utils/enums-types/input-names";
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
  setFormHasError: React.Dispatch<React.SetStateAction<boolean>>;
}

function SelectCategory({ setFormHasError }: Props): JSX.Element {
  const dispatch = useDispatch();
  const main_cat = useSelector(selectMainCat_addProduct);
  const sub_cat = useSelector(selectSubCat_addProduct);
  const uploadError_mainCat = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.main)
  );
  const uploadError_subCat = useSelector((state: RootState) =>
    selectUploadError_byInputName(state, inputNames.sub)
  );

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  useEffect(() => {
    setNoMainCat(true);
    if (main_cat !== "") {
      let main = capitalize(main_cat);
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
  }, [main_cat]);

  const onChangeHandler = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    dispatch(clearUploadError_byInputName(name));
    setFormHasError(false);
    if (name === inputNames.main) {
      dispatch(setMainCat_addProduct(value));
    } else {
      dispatch(setSubCat_addProduct(value));
    }
  };

  let error_main = uploadError_mainCat !== "";
  let error_sub = uploadError_subCat !== "";

  return (
    <Fragment>
      <Grid item>
        <FormControl error={error_main} className={styles.form_control}>
          <InputLabel id="main-cat-select">Main-Category</InputLabel>
          <Select
            labelId="main-cat-select"
            value={capitalize(main_cat)}
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
            {uploadError_mainCat}
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item>
        <FormControl error={error_sub} className={styles.form_control}>
          <InputLabel id="sub-cat-select">Sub-Category</InputLabel>
          <Select
            labelId="sub-cat-select"
            label="Sub Category"
            value={capitalize(sub_cat)}
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
            {uploadError_subCat}
          </FormHelperText>
        </FormControl>
      </Grid>
    </Fragment>
  );
}

export default memo(SelectCategory);
