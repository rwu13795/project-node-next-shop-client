import { Dispatch, SetStateAction, useState, useEffect, memo } from "react";

import { RequestParams } from "../sub-cat-list";

import {
  Grid,
  Checkbox,
  FormControlLabel,
  Modal,
  CircularProgress,
} from "@mui/material";

interface Props {
  filterKey: string;
  value: number;
  filterType: string;
  clearFilter: boolean;
  setParams: Dispatch<SetStateAction<RequestParams>>;
}

function FilterCheckBox({
  filterKey,
  value,
  filterType,
  clearFilter,
  setParams,
}: Props): JSX.Element {
  const [boxCheck, setBoxCheck] = useState<boolean>(false);

  useEffect(() => {
    if (clearFilter) {
      setBoxCheck(false);
    }
  }, [clearFilter]);

  const boxCheckHandler = () => {
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
  };

  return (
    <div>
      <FormControlLabel
        control={<Checkbox checked={boxCheck} onClick={boxCheckHandler} />}
        label={filterKey}
      />
      {filterKey}: #{value}
    </div>
  );
}

export default memo(FilterCheckBox);
