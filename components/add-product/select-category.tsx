import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { SelectChangeEvent } from "@mui/material";

import { ProductInfo, InfoChangeHandler } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/use-upload";
import { FieldNames } from "../../util/enums/input-field-names-enum";
import {
  mainCatArray,
  menCatArray,
  womenCatArray,
  kidsCatArray,
  MainCategory,
} from "../../util/enums/category-enum";

interface Props {
  infoChangeHandler: InfoChangeHandler;
  productInfo: ProductInfo;
  propError: Errors | null | undefined;
}

export default function SelectCategory(props: Props): JSX.Element {
  const { infoChangeHandler, productInfo, propError } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  useEffect(() => {
    if (productInfo.main_cat !== "") {
      setNoMainCat(false);
      switch (productInfo.main_cat) {
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

  const selectCategoryHandler = (e: SelectChangeEvent<string | number>) => {
    const inputValue = e.target.value;
    const inputField = e.target.name;
    infoChangeHandler(inputValue, inputField);
  };

  return (
    <Fragment>
      <FormControl
        variant="standard"
        sx={{ m: 0, minWidth: 120, boxShadow: 0 }}
      >
        <InputLabel style={{ fontSize: "1rem" }}>Main-Category</InputLabel>
        <Select
          value={productInfo.main_cat}
          name={FieldNames.main}
          label="Main Category"
          sx={{ m: 0, minWidth: 130 }}
          onChange={selectCategoryHandler}
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
      {propError && propError[FieldNames.main] && (
        <div>{propError[FieldNames.main]}</div>
      )}
      <span>
        <InputLabel style={{ fontSize: "15px" }}>Sub-Category</InputLabel>
        <Select
          value={productInfo.sub_cat}
          name={FieldNames.sub}
          style={{ minWidth: "90px" }}
          onChange={selectCategoryHandler}
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
      {propError && propError[FieldNames.sub] && (
        <div>{propError[FieldNames.sub]}</div>
      )}
    </Fragment>
  );
}
