import {
  Fragment,
  useState,
  FormEvent,
  Dispatch,
  SetStateAction,
  CSSProperties,
} from "react";
import Link from "next/link";

import { Divider, Grid, TextField, Box, Collapse, Paper } from "@mui/material";
import { SxProps, Theme } from "@mui/system";

import classes from "./_menu-list.module.css";
import {
  mainCatArray,
  kidsMenuList,
  menMenuList,
  womenMenuList,
  MainCategory,
} from "../../../utils/enums-types/product-category";

interface Props {
  setShowMenu_nav: Dispatch<SetStateAction<boolean>>;
  // setBorder: Dispatch<SetStateAction<CSSProperties>>;
  // border: CSSProperties;
  showMenu_nav: boolean;
}

const mui_sx = {
  paddingRight: 2,
  display: { xs: "none", md: "block" },
} as SxProps<Theme>;

export default function MenuList({
  setShowMenu_nav,
  // setBorder,
  // border,
  showMenu_nav,
}: Props): JSX.Element {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [currentCat, setCurrentCat] = useState<string>("");

  const openMenu = (cat: string) => {
    setCurrentCat(cat);
    // setBorder({ borderBottom: "2px #0099CC solid" });
    setShowMenu_nav(true);
    setShowMenu(true);
  };

  const closeMenu = () => {
    if (showMenu_nav) return;
    else setShowMenu(false);
    // setBorder({});
  };

  const onClickHandler = () => {
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
          className={classes.menu_list_items}
          onMouseLeave={closeMenu}
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
                className={classes.menu_list_items_column}
              >
                <Grid item className={classes.menu_list_items_column_head}>
                  {key.toUpperCase()}
                </Grid>
                {list &&
                  list[key].map((product) => {
                    return (
                      <Fragment key={product}>
                        <Grid onClick={onClickHandler}>
                          <Link
                            href={`/shop/${currentCat.toLowerCase()}/${product.toLowerCase()}`}
                          >
                            <a className={classes.menu_list_single_item}>
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
          <Grid item sx={mui_sx} key={index}>
            <Link href={`/shop/${cat.toLowerCase()}`}>
              <a
                className={classes.menu_list}
                // style={cat === currentCat ? border : {}}
                onMouseEnter={() => openMenu(cat)}
                onClick={onClickHandler}
              >
                {cat.toUpperCase()}
              </a>
            </Link>
          </Grid>
        );
      })}
      <Collapse
        in={showMenu && showMenu_nav}
        className={
          currentCat === MainCategory.accessories
            ? classes.menu_list_collapse_box_empty
            : classes.menu_list_collapse_box
        }
      >
        <ProductMenu currentCat={currentCat} />
      </Collapse>
    </Fragment>
  );
}
