import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

import { ProductCategory } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/use-upload";
import { FieldNames } from "./enums/field-names-enum";
import {
  mainCatArray,
  menCatArray,
  womenCatArray,
  kidsCatArray,
  MainCategory,
} from "./enums/category-enum";

interface Props {
  catChangeHandler: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  productCategory: ProductCategory;
  propError: Errors | null | undefined;
}

const SelectCategory = (props: Props): JSX.Element => {
  const { catChangeHandler, productCategory, propError } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  useEffect(() => {
    if (productCategory.main_cat !== "") {
      setNoMainCat(false);
      switch (productCategory.main_cat) {
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
  }, [productCategory.main_cat]);

  return (
    <Fragment>
      <span>
        <InputLabel style={{ fontSize: "15px" }}>Main-Category</InputLabel>
        <Select
          value={productCategory.main_cat}
          name={FieldNames.main}
          style={{ minWidth: "90px" }}
          onChange={catChangeHandler}
        >
          {mainCatArray.map((cat) => {
            return (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            );
          })}
        </Select>
      </span>
      {propError && propError[FieldNames.main] && (
        <div>{propError[FieldNames.main]}</div>
      )}
      <span>
        <InputLabel style={{ fontSize: "15px" }}>Sub-Category</InputLabel>
        <Select
          value={productCategory.sub_cat}
          name={FieldNames.sub}
          style={{ minWidth: "90px" }}
          onChange={catChangeHandler}
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
};

export default SelectCategory;
