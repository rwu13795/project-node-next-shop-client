import {
  Fragment,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from "react";
import Link from "next/link";

import {
  mainCatArray,
  kidsMenuList,
  menMenuList,
  womenMenuList,
  MainCategory,
} from "../../../utils/enums-types/product-category";

// UI //
import { Divider, Grid, TextField, Box, Collapse, Paper } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import styles from "./__menu-list.module.css";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

interface Props {
  setShowMenu_nav: Dispatch<SetStateAction<boolean>>;
  showMenu_nav: boolean;
  setCurrentCat: Dispatch<SetStateAction<string>>;
  currentCat: string;
  page_cat?: string;
}

const mui_sx = {
  paddingRight: 2,
  display: { xs: "none", md: "block" },
} as SxProps<Theme>;

const border_bot: CSSProperties = {
  borderBottom: "solid 3px #008ab4",
};

export default function MenuList({
  setShowMenu_nav,
  showMenu_nav,
  setCurrentCat,
  currentCat,
  page_cat,
}: Props): JSX.Element {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const openMenu = (cat: string) => {
    if (cat === MainCategory.accessories) {
      setShowMenu_nav(false);
      setShowMenu(false);
    } else {
      setCurrentCat(cat);
      setShowMenu_nav(true);
      setShowMenu(true);
    }
  };

  const onSubCatClickHandler = () => {
    dispatch(setPageLoading(true));
    setShowMenu_nav(false);
  };

  const onMainCatClickHandler = () => {
    dispatch(setPageLoading(true));
    setShowMenu_nav(false);
  };

  const ProductMenu = ({ currentCat }: { currentCat: string }): JSX.Element => {
    let list: { [key: string]: string[] } | undefined;
    let keys: string[] | undefined;
    switch (currentCat) {
      case MainCategory.women: {
        list = womenMenuList;
        keys = Object.keys(womenMenuList);
        break;
      }
      case MainCategory.men: {
        list = menMenuList;
        keys = Object.keys(menMenuList);
        break;
      }
      case MainCategory.kids: {
        list = kidsMenuList;
        keys = Object.keys(kidsMenuList);
        break;
      }
      default:
        list = undefined;
        break;
    }
    if (!list || !keys) {
      return <div></div>;
    }
    return (
      <Fragment>
        <Grid
          container
          flexDirection="row"
          wrap="nowrap"
          justifyContent="center"
          alignItems="flex-start"
          className={styles.menu_list_items}
        >
          {keys.map((key) => {
            return (
              <Grid
                item
                container
                wrap="nowrap"
                justifyContent="center"
                flexDirection="column"
                key={key}
                className={styles.menu_list_items_column}
              >
                <Grid item className={styles.menu_list_items_column_head}>
                  {key.toUpperCase()}
                </Grid>
                {list &&
                  list[key].map((product) => {
                    return (
                      <Fragment key={product}>
                        <Grid onClick={onSubCatClickHandler}>
                          <Link
                            href={`/shop/${currentCat.toLowerCase()}/${product.toLowerCase()}`}
                          >
                            <a className={styles.menu_list_single_item}>
                              {product}
                            </a>
                          </Link>
                        </Grid>
                      </Fragment>
                    );
                  })}
              </Grid>
            );
          })}
        </Grid>
      </Fragment>
    );
  };

  return (
    <Fragment>
      {mainCatArray.map((cat, index) => {
        return (
          <Grid item sx={mui_sx} key={index} onClick={onMainCatClickHandler}>
            <Link href={`/shop/${cat.toLowerCase()}`}>
              <a
                className={styles.menu_list}
                style={
                  cat.toLowerCase() === page_cat ||
                  (cat === currentCat && showMenu)
                    ? border_bot
                    : {}
                }
                onMouseEnter={() => openMenu(cat)}
              >
                {cat.toUpperCase()}
              </a>
            </Link>
          </Grid>
        );
      })}
      {currentCat !== MainCategory.accessories && (
        <Collapse
          in={showMenu && showMenu_nav}
          className={styles.menu_list_collapse_box}
        >
          <ProductMenu currentCat={currentCat} />
        </Collapse>
      )}
    </Fragment>
  );
}
