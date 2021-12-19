import { Dispatch, SetStateAction, useState, useEffect, memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectFilterTagToClear,
  selectProductFiltering,
  setFilterTagToClear,
  setProductFiltering,
} from "../../../../utils/redux-store/shopSlice";
import { RequestParams } from "../sub-cat-list";

// UI //
import {
  Grid,
  Checkbox,
  FormControlLabel,
  Modal,
  CircularProgress,
  Radio,
  FormControl,
  RadioGroup,
} from "@mui/material";
import styles from "./__checkbox.module.css";

interface Props {
  clearFilter: boolean;
  setParams: Dispatch<SetStateAction<RequestParams>>;
  setFilterTags: Dispatch<SetStateAction<Set<string>>>;
}

function FilterRadioBox({
  clearFilter,
  setParams,
  setFilterTags,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const filterTagToClear = useSelector(selectFilterTagToClear);

  const [value, setValue] = useState<string>("Featured");

  useEffect(() => {
    // after the filter tag was clicked, the tag will be added to the
    // "filterTagToClear" in the redux-store, and it signal all the "checkbox"
    // to compare its current checked value. If current checked value of the child
    // matches the "filterTagToClear", then run the "boxCheckHandler" to uncheck
    // that value and update the filter
    if (filterTagToClear === value) {
      boxCheckHandler("Featured");
      setFilterTags((prev) => {
        prev.delete(value);
        return prev;
      });
    }
    dispatch(setFilterTagToClear(""));
  }, [filterTagToClear, value, setFilterTags]);

  useEffect(() => {
    if (clearFilter) {
      setValue("Featured");
      setFilterTags(new Set());
    }
  }, [clearFilter, setFilterTags]);

  const boxCheckHandler = (sort: string) => {
    dispatch(setProductFiltering(true));

    if (filterTagToClear !== sort && sort !== "Featured") {
      setFilterTags((prev) => {
        // delete the old value first before adding the new radio checked value
        prev.delete(value);
        prev.add(sort);
        return prev;
      });
    }
    setValue(sort);

    setParams((prev) => {
      let filter = { ...prev.filter };
      if (sort === "Featured") {
        filter.priceSort = 0;
      } else if (sort === "Lowest to Highest") {
        filter.priceSort = 1;
      } else {
        filter.priceSort = -1;
      }
      return { ...prev, filter, pageNum: 1, filtering: true };
    });

    let elem = document.getElementById("sub_cat_filter_tag");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="gender"
        defaultValue="Featured"
        value={value ? value : "Featured"}
        name="radio-buttons-group"
        onChange={(e) => {
          boxCheckHandler(e.target.value);
        }}
      >
        <FormControlLabel
          value="Featured"
          control={<Radio color="primary" />}
          label="Featured"
          className={styles.radio_control}
        />
        <FormControlLabel
          value="Lowest to Highest"
          control={<Radio color="primary" />}
          label="Lowest to Highest"
          className={styles.radio_control}
        />
        <FormControlLabel
          value="Highest to Lowest"
          control={<Radio color="primary" />}
          label="Highest to Lowest"
          className={styles.radio_control}
        />
      </RadioGroup>
    </FormControl>
  );
}

export default memo(FilterRadioBox);
