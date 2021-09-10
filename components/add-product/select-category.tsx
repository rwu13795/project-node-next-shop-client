import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { ChangeEvent } from "react";

import { ProductCategory } from "../../pages/admin/add-product";

interface Props {
  catChangeHandler: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  productCategory: ProductCategory;
}

const SelectCategory = (props: Props) => {
  const { catChangeHandler, productCategory } = props;

  const mainCategory = ["Men", "Women", "Kid"];
  const womenCategory = [];
  const menCategory = [];
  const kidsCategory = [];

  return (
    <div>
      <InputLabel style={{ fontSize: "15px", color: "red" }}>Main</InputLabel>
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
    </div>
  );
};

export default SelectCategory;
