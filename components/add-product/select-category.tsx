import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

import { ProductCategory } from "../../pages/admin/add-product";
import { Errors } from "../../util/react-hooks/use-upload";
import { FieldTypes } from "./field-types";

interface Props {
  catChangeHandler: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  productCategory: ProductCategory;
  propError: Errors | null | undefined;
}

const SelectCategory = (props: Props): JSX.Element => {
  const { catChangeHandler, productCategory, propError } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  const mainCategory = ["Men", "Women", "Kids"];

  useEffect(() => {
    const womenCategory = ["blouses", "jeans", "shorts"];
    const menCategory = ["T-shirt", "coats", "shorts"];
    const kidsCategory = ["color-T", "shorts"];

    if (productCategory.main_cat !== "") {
      setNoMainCat(false);
      switch (productCategory.main_cat) {
        case "Men":
          setSubCatArray(menCategory);
          break;
        case "Women":
          setSubCatArray(womenCategory);
          break;
        case "Kids":
          setSubCatArray(kidsCategory);
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
          name={FieldTypes.main}
          style={{ minWidth: "90px" }}
          onChange={catChangeHandler}
        >
          {mainCategory.map((cat) => {
            return (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            );
          })}
        </Select>
      </span>
      {propError && propError[FieldTypes.main] && (
        <div>{propError[FieldTypes.main]}</div>
      )}
      <span>
        <InputLabel style={{ fontSize: "15px" }}>Sub-Category</InputLabel>
        <Select
          value={productCategory.sub_cat}
          name={FieldTypes.sub}
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
      {propError && propError[FieldTypes.sub] && (
        <div>{propError[FieldTypes.sub]}</div>
      )}
    </Fragment>
  );
};

export default SelectCategory;
