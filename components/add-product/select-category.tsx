import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ChangeEvent, Fragment, useEffect, useState } from "react";

import { ProductCategory } from "../../pages/admin/add-product";

interface Props {
  catChangeHandler: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  productCategory: ProductCategory;
}

const SelectCategory = (props: Props): JSX.Element => {
  const { catChangeHandler, productCategory } = props;

  const [noMainCat, setNoMainCat] = useState<boolean>(true);
  const [subCatArray, setSubCatArray] = useState<string[]>([""]);

  const mainCategory = ["Men", "Women", "Kids"];

  useEffect(() => {
    const womenCategory = ["blouses", "jeans", "shorts"];
    const menCategory = ["T-shirt", "coats", "shorts"];
    const kidsCategory = ["color-T", "shorts"];

    if (productCategory.main !== "") {
      setNoMainCat(false);
      switch (productCategory.main) {
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
  }, [productCategory.main]);

  return (
    <Fragment>
      <span>
        <InputLabel style={{ fontSize: "15px", color: "red" }}>
          Main-Category
        </InputLabel>
        <Select
          value={productCategory.main}
          name="main"
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
      <span>
        <InputLabel style={{ fontSize: "15px", color: "red" }}>
          Sub-Category
        </InputLabel>
        <Select
          value={productCategory.sub}
          name="sub"
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
    </Fragment>
  );
};

export default SelectCategory;
