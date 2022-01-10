import {
  Fragment,
  useState,
  Dispatch,
  SetStateAction,
  CSSProperties,
  memo,
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
import { Grid, Collapse } from "@mui/material";
import { SxProps, Theme } from "@mui/system";
import styles from "./__menu-list.module.css";
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

const page_cat_border: CSSProperties = {
  borderBottom: "solid 3px #008ab4",
};
const active_cat: CSSProperties = {
  borderBottom: "solid 3px #008ab4",
  color: "#008ab4",
};

function MenuList({
  setShowMenu_nav,
  showMenu_nav,
  setCurrentCat,
  currentCat,
  page_cat,
}: Props): JSX.Element {
  const dispatch = useDispatch();

  const [showMenu, setShowMenu] = useState<boolean>(false);

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
    setShowMenu(false);
  };

  const onMainCatClickHandler = () => {
    dispatch(setPageLoading(true));
    setShowMenu_nav(false);
    setShowMenu(false);
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
          onMouseLeave={() => setShowMenu(false)}
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
                        <Grid className={styles.menu_list_single_item_box}>
                          <Link
                            href={`/shop/${currentCat.toLowerCase()}/${product.toLowerCase()}`}
                          >
                            <a
                              className={styles.menu_list_single_item}
                              onClick={onSubCatClickHandler}
                            >
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
        let cat_style: CSSProperties = {};
        if (cat.toLowerCase() === page_cat) {
          cat_style = page_cat_border;
        }
        if (cat === currentCat && showMenu) {
          cat_style = active_cat;
        }

        return (
          <Grid item sx={mui_sx} key={index}>
            <Link href={`/shop/${cat.toLowerCase()}`}>
              <a
                className={styles.menu_list}
                style={cat_style}
                onMouseEnter={() => openMenu(cat)}
                onClick={onMainCatClickHandler}
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
          timeout={{ enter: 300, exit: 300 }}
        >
          <ProductMenu currentCat={currentCat} />
        </Collapse>
      )}
    </Fragment>
  );
}

export default memo(MenuList);
