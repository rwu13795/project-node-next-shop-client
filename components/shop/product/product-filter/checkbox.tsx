import { Dispatch, SetStateAction, useState, useEffect, memo } from "react";

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
import { useDispatch, useSelector } from "react-redux";
import {
  selectFilterTagToClear,
  selectProductFiltering,
  setFilterTagToClear,
  setProductFiltering,
} from "../../../../utils/redux-store/shopSlice";

interface Props {
  filterKey: string;
  value: number;
  filterType: string;
  clearFilter: boolean;
  setParams: Dispatch<SetStateAction<RequestParams>>;
  setFilterTags: Dispatch<SetStateAction<Set<string>>>;
}

function FilterCheckBox({
  filterKey,
  value,
  filterType,
  clearFilter,
  setParams,
  setFilterTags,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const filterTagToClear = useSelector(selectFilterTagToClear);

  const [boxCheck, setBoxCheck] = useState<boolean>(false);

  useEffect(() => {
    if (clearFilter) {
      setBoxCheck(false);
      setFilterTags(new Set());
    }
  }, [clearFilter, setFilterTags]);

  useEffect(() => {
    if (filterTagToClear === filterKey) {
      boxCheckHandler();
      dispatch(setFilterTagToClear(""));
      setFilterTags((prev) => {
        prev.delete(filterKey);
        return prev;
      });
    }
  }, [filterTagToClear, filterKey, setFilterTags]);

  const boxCheckHandler = () => {
    dispatch(setProductFiltering(true));

    if (filterTagToClear !== filterKey) {
      if (boxCheck) {
        setFilterTags((prev) => {
          prev.delete(filterKey);
          return prev;
        });
      } else {
        setFilterTags((prev) => {
          prev.add(filterKey);
          return prev;
        });
      }
    }

    setBoxCheck((prev) => !prev);
    setParams((prev) => {
      let filter = { ...prev.filter };
      if (boxCheck) {
        if (filterType === "color") {
          filter.colors.delete(filterKey);
        } else {
          filter.sizes.delete(filterKey);
        }
      } else {
        if (filterType === "color") {
          filter.colors.add(filterKey);
        } else {
          filter.sizes.add(filterKey);
        }
      }
      return { ...prev, filter, pageNum: 1, filtering: true };
    });
    window.scrollTo({ top: 0 });
  };

  return filterType === "price" ? (
    <FormControl component="fieldset">
      <RadioGroup
        aria-label="gender"
        defaultValue="Featured"
        name="radio-buttons-group"
        onChange={(e) => {
          console.log(e.target.value);
        }}
      >
        <FormControlLabel
          value="Featured"
          control={<Radio color="primary" />}
          label="Featured"
        />
        <FormControlLabel
          value="Low"
          control={<Radio color="primary" />}
          label="Lowest to Highest"
        />
        <FormControlLabel
          value="High"
          control={<Radio color="primary" />}
          label="Highest to Lowest"
        />
      </RadioGroup>
    </FormControl>
  ) : (
    <div className={styles.checkbox_container} onClick={boxCheckHandler}>
      <Checkbox checked={boxCheck} color="primary" />
      {filterType === "color" && (
        <div
          className={styles.color_ball}
          style={{ backgroundColor: `${filterKey}` }}
        ></div>
      )}
      <div>{filterKey}</div>

      <div>{`[${value}]`}</div>
    </div>
  );
}

export default memo(FilterCheckBox);
