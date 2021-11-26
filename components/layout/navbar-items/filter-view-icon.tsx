import { Fragment, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectOneItmePerRow,
  setOneItmePerRow,
  setOpenFilterModal,
} from "../../../utils/redux-store/shopSlice";

// UI //
import FilterListIcon from "@mui/icons-material/FilterList";
import CropLandscapeIcon from "@mui/icons-material/CropLandscape";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import styles from "./__filter-view-icon.module.css";

interface Props {}

function FilterViewIcon({}: Props): JSX.Element {
  const dispatch = useDispatch();
  const oneItemPerRow = useSelector(selectOneItmePerRow);

  const onFilterClickHandler = () => {
    dispatch(setOpenFilterModal(true));
  };
  const onViewClickHandler = () => {
    dispatch(setOneItmePerRow());
  };

  return (
    <Fragment>
      <div className={styles.filter_icon_box} onClick={onViewClickHandler}>
        <div className={styles.filter_text}>View</div>
        <div className={styles.filter_icon}>
          <CropLandscapeIcon
            className={
              oneItemPerRow ? styles.single_icon_active : styles.single_icon
            }
          />
          <SplitscreenIcon
            className={
              oneItemPerRow ? styles.split_icon : styles.split_icon_active
            }
          />
        </div>
      </div>
      <div className={styles.filter_icon_box} onClick={onFilterClickHandler}>
        <div className={styles.filter_icon}>
          <FilterListIcon />
        </div>
        <div className={styles.filter_text}>Filter</div>
      </div>
    </Fragment>
  );
}

export default memo(FilterViewIcon);
