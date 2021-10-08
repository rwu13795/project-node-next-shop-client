import {
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  SelectChangeEvent,
} from "@mui/material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";

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

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function SelectCategory(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo, propError, setErrors } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  useEffect(() => {
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
          setSubCatArray([""]);
      }
    }
  }, [productInfo.main_cat]);

  const onChangeHandler = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  return (
    <Fragment>
      <FormControl
        variant="standard"
        sx={{ m: 0, minWidth: 120, boxShadow: 0 }}
      >
        <InputLabel style={{ fontSize: "1rem" }}>Main-Category</InputLabel>
        <Select
          value={capitalize(productInfo.main_cat)}
          name={inputNames.main}
          label="Main Category"
          sx={{ m: 0, minWidth: 130 }}
          onChange={onChangeHandler}
        >
          {mainCatArray.map((cat) => {
            return (
              <MenuItem key={cat} value={cat}>
                {cat}
                <div
                  style={{
                    position: "relative",
                    left: "5%",
                    height: "1.55rem",
                    width: "1.55rem",
                    backgroundColor: "red",
                    borderRadius: "50%",
                  }}
                ></div>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {propError && propError[inputNames.main] && (
        <div>{propError[inputNames.main]}</div>
      )}
      <span>
        <InputLabel style={{ fontSize: "15px" }}>Sub-Category</InputLabel>
        <Select
          value={capitalize(productInfo.sub_cat)}
          name={inputNames.sub}
          style={{ minWidth: "90px" }}
          onChange={onChangeHandler}
          disabled={noMainCat}
        >
          {subCatArray.map((cat) => {
            return (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            );
          })}
        </Select>
      </span>

      <span>{propError[inputNames.sub]}</span>
    </Fragment>
  );
}
