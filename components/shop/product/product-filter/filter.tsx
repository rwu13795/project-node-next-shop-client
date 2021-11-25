import {
  Dispatch,
  SetStateAction,
  memo,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectProductFiltering,
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
  Button,
  ModalProps,
  Modal,
  CircularProgress,
} from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import styles from "./__filter.module.css";

interface Props {
  filterStats: FilterStats;
  filterTags: Set<string>;
  setParams: Dispatch<SetStateAction<RequestParams>>;
  setFilterTags: Dispatch<SetStateAction<Set<string>>>;
}

function ProductFilter({
  filterStats,
  filterTags,
  setParams,
  setFilterTags,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const productFiltering = useSelector(selectProductFiltering);

  const [clearFilter, setClearFilter] = useState<boolean>(false);

  console.log(filterStats.colors);

  const clearFilterHandler = () => {
    dispatch(setProductFiltering(true));
    setClearFilter(true);
    setParams({
      pageNum: 1,
      filter: {
        sizes: new Set<string>(),
        colors: new Set<string>(),
        priceSort: 0,
      },
      filtering: true,
    });

    window.scrollTo({ top: 0 });
    setTimeout(() => {
      setClearFilter(false);
    }, 1000);
  };

  return (
    <Grid container className={styles.main_container}>
      <div className={styles.header}>Filter + Sort</div>
      <div className={styles.item_num}>Items: {filterStats.matchingTotal}</div>
      <div>
        <FilterDrawer
          filterStats={filterStats}
          filterType="size"
          clearFilter={clearFilter}
          setParams={setParams}
          setFilterTags={setFilterTags}
        />
        <FilterDrawer
          filterStats={filterStats}
          filterType="color"
          clearFilter={clearFilter}
          setParams={setParams}
          setFilterTags={setFilterTags}
        />
        <FilterDrawer
          filterStats={filterStats}
          filterType="price"
          clearFilter={clearFilter}
          setParams={setParams}
          setFilterTags={setFilterTags}
        />
      </div>

      {filterTags.size > 0 && (
        <Button
          variant="outlined"
          onClick={clearFilterHandler}
          className={styles.clear_button}
        >
          Clear All <CancelOutlinedIcon sx={{ ml: "10px" }} />
        </Button>
      )}

      <Modal_Styled
        open={productFiltering}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CircularProgress className={styles.circular_progress} />
      </Modal_Styled>
    </Grid>
  );
}

export default memo(ProductFilter);

const Modal_Styled = styled(Modal)<ModalProps>(({}) => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
}));
