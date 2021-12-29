import { Dispatch, SetStateAction, memo, useState, Fragment } from "react";
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
import FilterSubComponent from "./filter-sub";

// UI //
import {
  Grid,
  styled,
  Divider,
  Box,
  Drawer,
  ModalProps,
  Modal,
  CircularProgress,
} from "@mui/material";
import CancelPresentationSharpIcon from "@mui/icons-material/CancelPresentationSharp";
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
  const openFilterModal = useSelector(selectOpenFilterModal);
  const isSmall = useMediaQuery({ query: "(max-width: 765px)" });

  const [clearFilter, setClearFilter] = useState<boolean>(false);

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

  const closeFilterModalHandler = () => {
    dispatch(setOpenFilterModal(false));
  };

  return (
    <Fragment>
      {isSmall ? (
        <div>
          <Drawer
            ModalProps={{
              keepMounted: true,
            }}
            open={openFilterModal}
            onClose={closeFilterModalHandler}
            anchor="right"
            sx={drawerModal}
          >
            <Box className={styles.filter_main_drawer_container}>
              <Grid container>
                <Grid item xs={6}>
                  <div style={{ paddingLeft: "1.5vw" }}>
                    <Image
                      src="/Nextjs-logo-1.svg"
                      alt="NextJS Logo"
                      width={165}
                      height={75}
                    />
                  </div>
                </Grid>
                <Grid item xs={6}>
                  <CancelPresentationSharpIcon
                    className={styles.close_icon}
                    onClick={closeFilterModalHandler}
                  />
                </Grid>
              </Grid>
              <Divider />
              <FilterSubComponent
                filterStats={filterStats}
                filterTags={filterTags}
                clearFilter={clearFilter}
                clearFilterHandler={clearFilterHandler}
                closeFilterModalHandler={closeFilterModalHandler}
                setParams={setParams}
                setFilterTags={setFilterTags}
                isSmall={isSmall}
              />
            </Box>
          </Drawer>
        </div>
      ) : (
        <FilterSubComponent
          filterStats={filterStats}
          filterTags={filterTags}
          clearFilter={clearFilter}
          clearFilterHandler={clearFilterHandler}
          closeFilterModalHandler={closeFilterModalHandler}
          setParams={setParams}
          setFilterTags={setFilterTags}
        />
      )}

      <Modal_Styled
        open={productFiltering}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CircularProgress className={styles.circular_progress} />
      </Modal_Styled>
    </Fragment>
  );
}

export default memo(
  dynamic(() => Promise.resolve(ProductFilter), {
    ssr: false,
  })
);

const Modal_Styled = styled(Modal)<ModalProps>(({}) => ({
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
}));

// set the background color in the main drawer "& .MuiDrawer-paper"
// have to use the MUI styles
const drawerModal = {
  width: "100vw",
  "& .MuiDrawer-paper": {
    backgroundImage:
      "linear-gradient(to left, rgba(34, 185, 255, 0.5) 0%, rgb(255, 255, 255) 15%)",
    boxSizing: "border-box",
  },
};
