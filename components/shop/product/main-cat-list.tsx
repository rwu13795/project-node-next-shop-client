import { useRef, useState, memo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import {
  selectOneItmePerRow,
  setFilterTagToClear,
} from "../../../utils/redux-store/shopSlice";
import ProductPreview from "../../image/product-preview/preview";
import useGetMoreProducts, {
  PageProductProps,
} from "../../../utils/react-hooks/get-more-products";
import useLastElementRef from "../../../utils/react-hooks/last-elem-ref";
import { FilterStats } from "../../../utils/enums-types/categories-interfaces";
import ProductFilter from "./product-filter/filter";
import {
  menMenuList,
  womenMenuList,
  kidsMenuList,
} from "../../../utils/enums-types/product-category";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

// UI //
import { Button, Divider, Grid } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import styles from "./__main-cat-list.module.css";

interface Props {}

function MainCatProductsList({}: Props): JSX.Element {
  const dispatch = useDispatch();
  const oneItemPerRow = useSelector(selectOneItmePerRow);

  return (
    <div className={styles.main_grid}>
      <div className={styles.main_title}>MEN&apos;S COLLECTIONS</div>
      <div className={styles.body_grid}></div>
    </div>
  );
}

export default memo(MainCatProductsList);
