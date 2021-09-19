import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { Fragment, useEffect, useState } from "react";

import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { inputNames } from "../../util/enums/input-names";
import { AddInfoEvents } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/add-product-upload";
import {
  mainCatArray,
  menCatArray,
  womenCatArray,
  kidsCatArray,
  MainCategory,
} from "../../util/enums/product-category";
import { capitalize } from "../../util/helper-functions/capitalize-first-letter";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
  propError: Errors | null | undefined;
}

export default function SelectCategory(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo, propError } = props;

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
          onChange={dispatchAddInfo}
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
          onChange={dispatchAddInfo}
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
      {propError && propError[inputNames.sub] && (
        <div>{propError[inputNames.sub]}</div>
      )}
    </Fragment>
  );
}
