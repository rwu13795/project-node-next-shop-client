import {
  Dispatch,
  SetStateAction,
  memo,
  useState,
  useCallback,
  useEffect,
  Fragment,
} from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { useMediaQuery } from "react-responsive";

import {
  selectOpenFilterModal,
  selectProductFiltering,
  setOpenFilterModal,
  setProductFiltering,
} from "../../../../utils/redux-store/shopSlice";
import { FilterStats } from "../../../../utils/enums-types/categories-interfaces";
import { RequestParams } from "../sub-cat-list";
import FilterDrawer from "./filter-drawer";

// UI //
import {
  Grid,
  Checkbox,
  FormControlLabel,
  styled,
  Divider,
  Button,
  Box,
  Drawer,
  ModalProps,
  Modal,
  CircularProgress,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import styles from "./__filter.module.css";

interface Props {
  filterStats: FilterStats;
  filterTags: Set<string>;
  clearFilter: boolean;
  clearFilterHandler: () => void;
  closeFilterModalHandler: () => void;
  setParams: Dispatch<SetStateAction<RequestParams>>;
  setFilterTags: Dispatch<SetStateAction<Set<string>>>;
  isSmall?: boolean;
}

function FilterSubComponent({
  filterStats,
  filterTags,
  clearFilter,
  clearFilterHandler,
  closeFilterModalHandler,
  setParams,
  setFilterTags,
  isSmall,
}: Props): JSX.Element {
  const filterTypes = ["size", "color", "price"];

  return (
    <Grid container className={styles.main_container}>
      <div className={styles.header}>Filter + Sort</div>
      <div className={styles.item_num}>Items: {filterStats.matchingTotal}</div>
      <div>
        {filterTypes.map((type) => {
          return (
            <FilterDrawer
              key={type}
              filterStats={filterStats}
              filterType={type}
              clearFilter={clearFilter}
              setParams={setParams}
              setFilterTags={setFilterTags}
            />
          );
        })}
      </div>
      <div className={styles.buttons_container}>
        {filterTags.size > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={clearFilterHandler}
            className={styles.buttons}
          >
            Clear All <CancelOutlinedIcon sx={{ ml: "10px" }} />
          </Button>
        )}
        {isSmall && (
          <Button
            variant="outlined"
            onClick={closeFilterModalHandler}
            className={styles.buttons}
          >
            Apply Filters <CheckCircleOutlineIcon sx={{ ml: "10px" }} />
          </Button>
        )}
      </div>
    </Grid>
  );
}

export default memo(FilterSubComponent);
